import 'dotenv/config'
import { constants } from 'ethers'
import { Contract } from 'zksync-web3'
import { estimateGasFee, sendTransaction } from '../../utils'
import ABI from '../../abi/zksync/mailzero/abi.json'
import type { Wallet } from 'zksync-web3'

function getCalls() {
  return {
    contract: new Contract('0xc94025c2eA9512857BD8E1e611aB9b773b769350', ABI),
    functionName: 'setApprovalForAll',
    args: [constants.AddressZero, true],
  }
}

export default {
  title: 'MailZero',
  description: '授权 NFT',
  value: 'mailzero',
  estimateGasFee: (signer: Wallet) => estimateGasFee(signer, getCalls()),
  sendTransaction: (signer: Wallet) => sendTransaction(signer, getCalls()),
}
