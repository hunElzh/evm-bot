import axios from 'axios'
import base64 from 'crypto-js/enc-base64'
import hmacSHA256 from 'crypto-js/hmac-sha256'
import { apikey, passPhrase, secretkey } from '../configs/funding'
import type {
  Balance,
  Currency,
  TokenSymbol,
  TransferFundParams,
  WithdrawParams,
} from '../types'
import { Wallet } from 'ethers'

const ZKSYNC_ERA_API_URL =
  process.env.NETWORK === 'mainnet'
    ? 'https://block-explorer-api.mainnet.zksync.io'
    : 'https://block-explorer-api.testnets.zksync.dev'

// export async function getETHPrice(): Promise<number> {
//   const res = await axios.get('https://api.binance.com/api/v3/ticker/price', {
//     params: {
//       symbol: 'ETHUSDT',
//     },
//   })
//   return Number(res.data.price)
// }

export async function getTokenPrice(symbol: TokenSymbol): Promise<number> {
  const res = await axios.get('https://min-api.cryptocompare.com/data/price', {
    params: {
      fsym: symbol,
      tsyms: 'USD',
    },
  })
  return res.data.USD
}

export async function getLatestTransaction(address: string) {
  const res = await axios.get(`${ZKSYNC_ERA_API_URL}/transactions`, {
    params: {
      address,
      pageSize: 1,
      page: 1,
    },
  })
  return res.data.items
}

export async function getCurrencies(
  ccy = 'ETH',
  op: 'withdraw' | 'deposit',
): Promise<Currency[]> {
  const path = `/api/v5/asset/currencies?ccy=${ccy}`
  const timestamp = new Date().toISOString()
  const sign = base64.stringify(hmacSHA256(`${timestamp}GET${path}`, secretkey))
  const res = await axios.get(`https://www.okx.com${path}`, {
    headers: {
      'OK-ACCESS-KEY': apikey,
      'OK-ACCESS-SIGN': sign,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': passPhrase,
    },
  })

  const withdrawBlacklist = [
    'ETHK-OKTC',
    'ETH-Starknet',
    'USDC-OKTC',
    'USDC-TRC20',
    'USDC-Solana',
    'USDT-OKTC',
    'USDT-TRC20',
    'USDT-Solana',
  ]
  const depositBlacklist = [
    ...withdrawBlacklist,
    'ETH-zkSync Lite',
    'USDC-Polygon (Bridged)',
    'USDC-Avalanche C-Chain',
    'USDT-Polygon',
    'USDT-Avalanche C-Chain',
  ]

  return res.data.data.filter((currency: Currency) => {
    return op === 'withdraw'
      ? currency.canWd && !withdrawBlacklist.includes(currency.chain)
      : currency.canDep && !depositBlacklist.includes(currency.chain)
  })
}

export async function getBalances(ccy = 'ETH'): Promise<Balance[]> {
  const path = `/api/v5/asset/balances?ccy=${ccy}`
  const timestamp = new Date().toISOString()
  const sign = base64.stringify(hmacSHA256(`${timestamp}GET${path}`, secretkey))
  const res = await axios.get(`https://www.okx.com${path}`, {
    headers: {
      'OK-ACCESS-KEY': apikey,
      'OK-ACCESS-SIGN': sign,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': passPhrase,
    },
  })
  return res.data.data
}

export async function getSubAccountBalances(
  subAcct: string,
  ccy = 'ETH',
): Promise<Balance[]> {
  const path = `/api/v5/asset/subaccount/balances?subAcct=${subAcct}&ccy=${ccy}`
  const timestamp = new Date().toISOString()
  const sign = base64.stringify(hmacSHA256(`${timestamp}GET${path}`, secretkey))
  const res = await axios.get(`https://www.okx.com${path}`, {
    headers: {
      'OK-ACCESS-KEY': apikey,
      'OK-ACCESS-SIGN': sign,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': passPhrase,
    },
  })
  return res.data.data
}

export async function withdraw(data: WithdrawParams) {
  const path = `/api/v5/asset/withdrawal`
  const timestamp = new Date().toISOString()
  const sign = base64.stringify(
    hmacSHA256(`${timestamp}POST${path}${JSON.stringify(data)}`, secretkey),
  )

  const res = await axios.post(`https://www.okx.com${path}`, data, {
    headers: {
      'OK-ACCESS-KEY': apikey,
      'OK-ACCESS-SIGN': sign,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': passPhrase,
    },
  })
  return res.data.data
}

export async function transferFund(data: TransferFundParams) {
  const path = `/api/v5/asset/transfer`
  const timestamp = new Date().toISOString()
  const sign = base64.stringify(
    hmacSHA256(`${timestamp}POST${path}${JSON.stringify(data)}`, secretkey),
  )

  const res = await axios.post(`https://www.okx.com${path}`, data, {
    headers: {
      'OK-ACCESS-KEY': apikey,
      'OK-ACCESS-SIGN': sign,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': passPhrase,
    },
  })
  return res.data.data
}

export async function getSatoriTokenBalance(signer: Wallet){
  // 通过address计算出签名message，后续计算Authorization依赖此message
  const getSignInfo = 'https://zkevm.satori.finance/api/auth/auth/generateNonce';
  const signInfoParams = {
    address: signer.address
  }
  const nonceRes = await axios.post(getSignInfo, signInfoParams);
  const nonce = nonceRes.data.nonce;

  // 计算权限参数
  const getJWTInfo = 'https://zkevm.satori.finance/api/auth/auth/token';
  const JWTInfoParams = {
    address: signer.address,
    signature: await signer.signMessage(nonce)
  }
  const JWTRes = await axios.post(getJWTInfo, JWTInfoParams)
  const autohrization = JWTRes.data.data;

  // 计算账户信息
  const getAccountInfo = 'https://zkevm.satori.finance/api/contract-provider/contract/portfolioAccount'
  const params = {
    coinId: 4,
    timeType: 1
  }
  const accountRes = await axios.post(getAccountInfo, params, {
    headers: {
      'Authorization': autohrization,
    }
  });

  return accountRes.data.data;
}

