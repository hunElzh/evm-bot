import 'dotenv/config'
import { BigNumber, constants, utils } from 'ethers'
import { Contract } from 'zksync-web3'
import {
  approveToken,
  estimateGasFee,
  getTokenDecimals,
  sendTransaction,
} from '../../utils'
import logger from '../../utils/logger'
import { token } from '../../constants'
import { swapConfig } from '../../configs/modules'
import routerABI from '../../abi/zksync/syncswap/router.json'
import classicPoolABI from '../../abi/zksync/syncswap/classicPool.json'
import classicPoolFactoryABI from '../../abi/zksync/syncswap/classicPoolFactory.json'
import type { Wallet } from 'zksync-web3'
import type { Logger } from '../../utils/logger'

const ROUTER_CONTRACT_ADDRESS =
  process.env.NETWORK === 'mainnet'
    ? '0x2da10A1e27bF85cEdD8FFb1AbBe97e53391C0295'
    : '0xB3b7fCbb8Db37bC6f572634299A58f51622A847e'

const CLASSIC_POOL_CONTRACT_ADDRESS =
  process.env.NETWORK === 'mainnet'
    ? '0xf2DAd89f2788a8CD54625C60b55cD3d2D0ACa7Cb'
    : '0xf2FD2bc2fBC12842aAb6FbB8b1159a6a83E72006'

async function getConfig(signer: Wallet) {
  const classicPoolFactory = new Contract(
    CLASSIC_POOL_CONTRACT_ADDRESS,
    classicPoolFactoryABI,
    signer,
  )
  const poolAddress: string = await classicPoolFactory.getPool(
    token[swapConfig.from].ZKSYNC_ERA,
    token[swapConfig.to].ZKSYNC_ERA,
  )

  let amountIn = utils.parseEther(
    (
      Math.random() * (swapConfig.maxAmount - swapConfig.minAmount) +
      swapConfig.minAmount
    ).toFixed(5),
  )

  if (token[swapConfig.from].ZKSYNC_ERA !== token.ETH.ZKSYNC_ERA) {
    amountIn = await signer.getBalance(token[swapConfig.from].ZKSYNC_ERA)
  }

  return {
    poolAddress,
    tokenIn: token[swapConfig.from].ZKSYNC_ERA,
    amountIn,
  }
}

async function getCalls(
  signer: Wallet,
  config: Awaited<ReturnType<typeof getConfig>>,
  logger?: Logger,
) {
  const { poolAddress, tokenIn, amountIn } = config
  const pool = new Contract(poolAddress, classicPoolABI, signer)
  const withdrawMode = 1
  const swapData = utils.defaultAbiCoder.encode(
    ['address', 'address', 'uint8'],
    [tokenIn, signer.address, withdrawMode],
  )

  const steps = [
    {
      pool: poolAddress,
      data: swapData,
      callback: constants.AddressZero,
      callbackData: '0x',
    },
  ]

  const paths = [
    {
      steps,
      tokenIn:
        tokenIn === token.ETH.ZKSYNC_ERA ? constants.AddressZero : tokenIn,
      amountIn,
    },
  ]

  const amountOut: BigNumber = await pool.getAmountOut(
    tokenIn,
    amountIn,
    signer.address,
  )

  const minAmountOut = amountOut.sub(
    amountOut
      .mul(utils.parseUnits(String(swapConfig.slippage), 4))
      .div(10 ** 6),
  )

  const tokenInDecimals = await getTokenDecimals(signer, tokenIn)
  const tokenOutDecimals = await getTokenDecimals(
    signer,
    token[swapConfig.to].ZKSYNC_ERA,
  )

  logger?.info(
    signer.address,
    `${utils.formatUnits(amountIn, tokenInDecimals).toString()} ${
      swapConfig.from
    } 兑换为 ${utils.formatUnits(minAmountOut, tokenOutDecimals).toString()} ${
      swapConfig.to
    }`,
  )

  return {
    contract: new Contract(ROUTER_CONTRACT_ADDRESS, routerABI),
    functionName: 'swap',
    args: [
      paths,
      minAmountOut,
      BigNumber.from(Math.floor(Date.now() / 1000)).add(1800),
    ],
    options:
      tokenIn === token.ETH.ZKSYNC_ERA
        ? {
            value: amountIn,
          }
        : {},
  }
}

async function _estimateGasFee(signer: Wallet) {
  const { poolAddress, tokenIn } = await getConfig(signer)
  const calls = await getCalls(signer, {
    poolAddress,
    tokenIn,
    amountIn: BigNumber.from(0),
  })
  return estimateGasFee(signer, calls)
}

async function _sendTransaction(signer: Wallet) {
  const { poolAddress, tokenIn, amountIn } = await getConfig(signer)
  const calls = await getCalls(
    signer,
    {
      poolAddress,
      tokenIn,
      amountIn,
    },
    logger,
  )

  if (amountIn.eq(0)) {
    logger.error(signer.address, `${swapConfig.from} 余额为 0`)
    return
  }

  if (tokenIn !== token.ETH.ZKSYNC_ERA) {
    await approveToken(signer, tokenIn, ROUTER_CONTRACT_ADDRESS, amountIn)
  }
  return sendTransaction(signer, calls)
}

export default {
  title: 'SyncSwap',
  description: `${swapConfig.from} 兑换成 ${swapConfig.to}`,
  value: 'syncswap',
  estimateGasFee: _estimateGasFee,
  sendTransaction: _sendTransaction,
}
