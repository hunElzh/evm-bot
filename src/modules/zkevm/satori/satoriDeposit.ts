import {SatoriBasic} from './SatoriBasic'
import { Wallet ,Contract } from 'zksync-web3'
import ABI from '../../../abi/zkevm/satori/abi.json'
import {getTokenBalance, getProvider, estimateGasFee, sendTransaction, showTokenBalance, readTerminalLine, approveToken} from '../../../utils'
import { polygonZkEvmTokens } from '@pancakeswap/tokens'
import type { Calls } from '../../../types'
import { ethers } from 'ethers'
import { contract } from '../../../constants'

let depositToken = polygonZkEvmTokens.usdt;
let calls: Calls;

async function getDepositArgs(signer: Wallet) {
  const bizNo = new SatoriBasic({
    workerId: 1
  }).nextId();
  const bizTime = new Date().valueOf();
  const usdtAddress = depositToken.address;
  let amount: any = 0;

  await showTokenBalance(signer);

  // 仅为了交互合约，因此默认存入0
  amount = 0;
  // amount = amount == 0 || null || undefined ? (await getTokenBalance(signer.provider, usdtAddress, await signer.getAddress())).toBigInt() : amount;

  return [bizNo, bizTime, usdtAddress, amount]
}

async function getCalls(signer: Wallet) {
  const contractInstance = new Contract(contract.POLY_ZKEVM.SAOTRI.ROUTER, ABI);
  const functionName = 'depositCoin'
  const args = await getDepositArgs(signer);
  const options = {
    gasLimit: ethers.utils.parseEther('0.01')
  }

  return {
    contract: contractInstance,
    functionName: functionName,
    args: args,
    options: options, 
  }
}


async function _sendTransaction(signer: Wallet){

  const amountIn = calls.args[3]!;

  // 这段逻辑是否需要
  if (!depositToken.isNative) {
    await approveToken(signer, depositToken.address, contract.POLY_ZKEVM.SAOTRI.ROUTER, amountIn)
  }

  const res = await sendTransaction(signer, calls);
  console.log(res)

  return res;
}

async function _estimateGasFee(signer: Wallet){
  calls = await getCalls(signer);
  return estimateGasFee(signer, calls);
}


export default {
  title: 'SatoriDeposit',
  description: `存入usdt`,
  value: 'satoriDeposit',
  estimateGasFee: _estimateGasFee,
  sendTransaction: _sendTransaction,
}
