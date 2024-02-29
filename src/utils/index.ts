import 'dotenv/config'
import { providers, utils } from 'ethers'
import { Contract, Provider } from 'zksync-web3'
import c from 'picocolors'
import { resolvedWallets } from '../configs/wallets'
import { getLatestTransaction, getTokenPrice } from '../api'
import { rpc, token } from '../constants'
import dayjs from './dayjs'
import type { BigNumber } from 'ethers'
import type { Wallet } from 'zksync-web3'
import type { Calls } from '../types'
import * as readline from 'readline'

export function getProvider(rpcUrl = rpc.POLYGON_ZKEVM) {
  // return new Provider('https://polygon-zkevm.drpc.org')
  // return new Provider('https://polygon-zkevm-mainnet.public.blastapi.io')
  return new Provider(rpcUrl)
}

export function isNativeToken(tokenAddress: string) {
  return Object.values(token.ETH).includes(tokenAddress)
}

export function getTokenDecimals(
  signerOrProvider: Provider | Wallet,
  tokenAddress: string,
): Promise<number> {
  const contract = new Contract(
    tokenAddress,
    ['function decimals() view returns (uint8)'],
    signerOrProvider,
  )
  return contract.decimals()
}

export function getTokenBalance(
  provider: Provider,
  tokenAddress: string,
  address: string,
): Promise<BigNumber> {
  if (isNativeToken(tokenAddress)) {
    return provider.getBalance(address)
  }
  const contract = new Contract(
    tokenAddress,
    ['function balanceOf(address owner) view returns (uint256)'],
    provider,
  )
  return contract.balanceOf(address)
}

export async function approveToken(
  signer: Wallet,
  tokenAddress: string,
  spender: string,
  amount: BigNumber,
) {
  const contract = new Contract(
    tokenAddress,
    ['function approve(address spender, uint256 amount)'],
    signer,
  )
  const tx = await contract.approve(spender, amount)
  return tx.wait()
}

export async function estimateGasFee(signer: Wallet, calls: Calls) {
  const { contract, functionName, args, options } = calls
  const [gas, gasPrice, ethPrice] = await Promise.all([
    signer.estimateGas({
      to: contract.address,
      data: contract.interface.encodeFunctionData(functionName, args),
      ...options,
    }),
    signer.getGasPrice(),
    getTokenPrice('ETH'),
  ])
  return Number(
    (Number(gas) * Number(utils.formatEther(gasPrice)) * ethPrice).toFixed(2),
  )
}

export async function estimateTransferGasFee(
  provider: Provider,
  tokenAddress: string,
) {
  const contract = new Contract(
    tokenAddress,
    ['function transfer(address to, uint256 amount)'],
    provider,
  )

  const transferFunction = isNativeToken(tokenAddress)
    ? provider.estimateGas({
        from: '0xD5aF2958d8A6D6d8af8F6aafC00E4631AaC63bbC',
        to: '0xD5aF2958d8A6D6d8af8F6aafC00E4631AaC63bbC',
        value: 0,
      })
    : contract.estimateGas.transfer(
        '0xD5aF2958d8A6D6d8af8F6aafC00E4631AaC63bbC',
        0,
        {
          from: '0xD5aF2958d8A6D6d8af8F6aafC00E4631AaC63bbC',
        },
      )

  const [gas, gasPrice, ethPrice] = await Promise.all([
    transferFunction,
    provider.getGasPrice(),
    getTokenPrice('ETH'),
  ])
  const gasFeeETH = Number(gas) * Number(utils.formatEther(gasPrice))
  return {
    gasFeeETH,
    gasFeeUSD: Number((gasFeeETH * ethPrice).toFixed(2)),
  }
}

export async function sendTransaction(signer: Wallet, calls: Calls) {
  const nonce = await signer.getTransactionCount()
  const { contract, functionName, args } = calls
  const { hash } = await contract.connect(signer)[functionName](...args)
  return { address: signer.address, nonce, tx: hash }
}

export async function getLatestTransactionAge(address: string) {
  const res = await getLatestTransaction(address)
  const { receivedAt } = res[0] || { receivedAt: 0 }
  const age = dayjs(receivedAt).fromNow()
  const color = dayjs().diff(receivedAt, 'day') >= 7 ? c.red : c.green
  return c.bold(color(age))
}

export function tokenToUSD(amount: number | string, tokenPrice: number) {
  return Number((Number(amount) * tokenPrice).toFixed(2))
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function generateWalletTitle(address: string) {
  const wallet = resolvedWallets.find(
    (w) => w.address.toLowerCase() === address.toLowerCase(),
  )!
  return `${wallet.label} ${c.dim(`(${shortenAddress(wallet.address)})`)}`
}

export function retry<T>(
  fn: (...args: any[]) => Promise<T>,
  times = 0,
  delay = 0,
) {
  return (...args: any[]): Promise<T> =>
    new Promise((resolve, reject) => {
      const attempt = async () => {
        try {
          resolve(await fn(...args))
        } catch (err) {
          if (times-- <= 0) {
            reject(err)
          } else {
            setTimeout(attempt, delay)
          }
        }
      }
      attempt()
    })
}


export function readTerminalLine(query:string) : Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
      rl.close();
    });
  });
}

export async function showTokenBalance(signer:Wallet) {
  console.log('---------------------目前余额----------------------')
  const [ethBalance, usdcBalance, usdtBalance] = await Promise.all([
    getTokenBalance(signer.provider, token.ETH.POLYGON_ZKEVM, signer.address),
    getTokenBalance(signer.provider, token.USDC.POLYGON_ZKEVM, signer.address),
    getTokenBalance(signer.provider, token.USDT.POLYGON_ZKEVM, signer.address),
  ])
  const ethShow = utils.formatEther(ethBalance)
  const usdcShow = Number(usdcBalance) / (10 ** 6);
  const usdtShow = Number(usdtBalance) / (10 ** 6)
  console.log(`${signer.address}\nETH:${ethShow}\nUSDC:${usdcShow}\nUSDT:${usdtShow}`)
}

export const formatBalance = (rawBalance: string) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2);
  return balance;
};

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex);
  return chainIdNum;
};
