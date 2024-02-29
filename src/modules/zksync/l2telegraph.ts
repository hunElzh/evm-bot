import 'dotenv/config'
import { constants } from 'ethers'
import { Contract } from 'zksync-web3'
import { estimateGasFee, sendTransaction } from '../../utils'
import ABI from '../../abi/zksync/l2telegraph/abi.json'
import type { Wallet } from 'zksync-web3'

function getCalls() {
  return {
    contract: new Contract('0xD43A183C97dB9174962607A8b6552CE320eAc5aA', ABI),
    functionName: 'setApprovalForAll',
    args: [constants.AddressZero, true],
  }
}

export default {
  title: 'l2telegraph',
  description: '授权 NFT',
  value: 'l2telegraph',
  estimateGasFee: (signer: Wallet) => estimateGasFee(signer, getCalls()),
  sendTransaction: (signer: Wallet) => sendTransaction(signer, getCalls()),
}
