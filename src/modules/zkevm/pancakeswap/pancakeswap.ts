import { Native, ChainId, CurrencyAmount, TradeType, Percent, BigintIsh, ZERO, ERC20Token } from '@pancakeswap/sdk'
import { SmartRouter, SMART_ROUTER_ADDRESSES, SwapRouter } from '@pancakeswap/smart-router/evm'
import { polygonZkEvmTokens } from '@pancakeswap/tokens'
import { V2_SUBGRAPHS, V3_SUBGRAPHS } from '@pancakeswap/chains'
import { createPublicClient, http } from 'viem'
import { polygonZkEvm } from 'viem/chains'
import { GraphQLClient } from 'graphql-request'
import { getSatoriTokenBalance, getTokenPrice } from '../../../api'
import ABI from '../../../abi/zkevm/pancakeswap/abi.json'
import { BigNumber, BigNumberish, ethers, utils } from 'ethers'
import { Wallet, Contract } from 'zksync-web3'
import { approveToken,  getProvider, getTokenBalance, showTokenBalance, readTerminalLine  } from '../../../utils'
import type { Calls } from '../../../types'
import logger from '../../../utils/logger'
import { token } from '../../../constants'
import prompts from 'prompts'

const L2_DEADLINE_FROM_NOW = 6000 * 5

const provider = getProvider()
const gasLimit = ethers.utils.parseEther('0.01')
let amountIn: BigNumber;
let swapFrom: Native|ERC20Token = Native.onChain(ChainId.POLYGON_ZKEVM);
let swapTo: Native|ERC20Token = polygonZkEvmTokens.usdt

const chainId = ChainId.POLYGON_ZKEVM;

const v3SubgraphClient: any = new GraphQLClient(V3_SUBGRAPHS[chainId]!)
const v2SubgraphClient: any = new GraphQLClient(V2_SUBGRAPHS[chainId]!)
let calls: Calls;

const swapPair = [
  {
    name: 'ETH-USDT',
    from: Native.onChain(ChainId.POLYGON_ZKEVM),
    to: polygonZkEvmTokens.usdt,
  },
  {
    name: 'ETH-USDC',
    from: Native.onChain(ChainId.POLYGON_ZKEVM),
    to: polygonZkEvmTokens.usdc,
  },
  {
    name: 'USDC-ETH',
    from: polygonZkEvmTokens.usdc,
    to: Native.onChain(ChainId.POLYGON_ZKEVM),
  },
  {
    name: 'USDC-USDT',
    from: polygonZkEvmTokens.usdc,
    to: polygonZkEvmTokens.usdt,
  },
  {
    name: 'USDT-ETH',
    from: polygonZkEvmTokens.usdt,
    to: Native.onChain(ChainId.POLYGON_ZKEVM),
  },
  {
    name: 'USDT-USDC',
    from: polygonZkEvmTokens.usdt,
    to: polygonZkEvmTokens.usdc,
  }
]

const publicClient = createPublicClient({
  chain: polygonZkEvm,
  transport: http('https://rpc.ankr.com/polygon_zkevm')
})


const quoteProvider = SmartRouter.createQuoteProvider({
  onChainProvider: () => publicClient,
})

const getSwapPair = async() => {
  const swapPairChoice = swapPair.map(m => {
    return {
      title: m.name,
      value: m
    }
  })

  const { pair: p } = await prompts({
    type: 'select',
    name: 'pair',
    message: '请选择交易对',
    choices: swapPairChoice,
  })

  return p
}

// 获取合约参数
const getArgs = async (signer: Wallet):Promise<any[]> => {
  const address: any = signer.address;
  await showTokenBalance(signer);

  // 1. 选择模式ETH-USDT/USDC  USDC/USDT-ETH
  const swapPair = await getSwapPair()
  swapFrom = swapPair.from;
  swapTo = swapPair.to;

  // // 2. 根据选择的模式调整
  // const input:string = await readTerminalLine(`请输入需要转换的${swapFrom.name}数量:`)

  amountIn = BigNumber.from(0);
  const amount = CurrencyAmount.fromRawAmount(swapFrom, amountIn.toBigInt())

  const [v2Pools, v3Pools] = await Promise.all([
    SmartRouter.getV2CandidatePools({
      onChainProvider: () => publicClient,
      v2SubgraphProvider: () => v2SubgraphClient,
      v3SubgraphProvider: () => v3SubgraphClient,
      currencyA: amount.currency,
      currencyB: swapTo,
    }),
    SmartRouter.getV3CandidatePools({
      onChainProvider: () => publicClient,
      subgraphProvider: () => v3SubgraphClient,
      currencyA: amount.currency,
      currencyB: swapTo,
      subgraphCacheFallback: false,
    }),
  ])
  const pools = [...v2Pools, ...v3Pools]
  const trade: any = await SmartRouter.getBestTrade(amount, swapTo, TradeType.EXACT_INPUT, {
    gasPriceWei: () => publicClient.getGasPrice(),
    maxHops: 2,
    maxSplits: 2,
    poolProvider: SmartRouter.createStaticPoolProvider(pools),
    quoteProvider,
    quoterOptimization: true,
  })

  const { calldata,value } = SwapRouter.swapCallParameters(trade, {
    recipient: address,
    slippageTolerance: new Percent(1),
  })

  const block = await provider.getBlock(await provider.getBlockNumber())!;

  const deadline = block.timestamp + L2_DEADLINE_FROM_NOW

  return [deadline, [calldata]]
}

// 拼接合约对象
const getCalls = async (signer: Wallet) => {
  const args = await getArgs(signer);

  const contract = new Contract(SMART_ROUTER_ADDRESSES[chainId], ABI, signer);
  const functionName = 'multicall'

  const options = {
    value: (swapFrom.isNative ? amountIn : ZERO),
    gasLimit: gasLimit
  }

  return {
    contract: contract,
    functionName: functionName,
    args: args,
    options: options,
  }
}

async function _estimateGasFee(signer: Wallet) {
  calls = await getCalls(signer);
  const { contract, functionName, args, options } = calls;

  const signerEstimateGas = await signer.estimateGas({
    to: contract.address,
    data: contract.interface.encodeFunctionData(functionName, args),
    ...options,
  })

  const [gas, gasPrice, ethPrice] = await Promise.all([
    signerEstimateGas,
    signer.getGasPrice(),
    getTokenPrice('ETH'),
  ])
  return Number(
    (Number(gas) * Number(utils.formatEther(gasPrice)) * ethPrice).toFixed(2),
  )
}

async function _sendTransaction(signer: Wallet) {
  const { contract, functionName, args, options } = calls;
  const amountIn:any = options!.value;

  if (!swapFrom.isNative) {
    await approveToken(signer, token.ETH.POLYGON_ZKEVM, swapFrom.address, amountIn)
  }

  const nonce = await signer.getTransactionCount()
  const { hash } = await contract.connect(signer)[functionName](...args, {
    value: amountIn
  })
  return { address: signer.address, nonce, tx: hash }
}


export default {
  title: 'PancakeSwap',
  description: `${swapFrom.name} 兑换成 ${swapTo.name}`,
  value: 'pancakeswap',
  estimateGasFee: _estimateGasFee,
  sendTransaction: _sendTransaction,
}
