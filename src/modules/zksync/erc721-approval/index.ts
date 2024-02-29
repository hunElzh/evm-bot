import 'dotenv/config'
import { constants } from 'ethers'
import { Contract } from 'zksync-web3'
import { estimateGasFee, sendTransaction } from '../../../utils'
import ABI from '../../../abi/common/erc721-approval.json'
import items from './items'
import type { Wallet } from 'zksync-web3'

function getCalls(contractAddress: string) {
  return {
    contract: new Contract(contractAddress, ABI),
    functionName: 'setApprovalForAll',
    args: [constants.AddressZero, true],
  }
}

export default items.map((item) => ({
  title: item.title,
  description: '授权 NFT',
  value: item.value,
  type: 'erc721_approval',
  estimateGasFee: (signer: Wallet) => 
    estimateGasFee(signer, getCalls(item.contractAddress)),
  sendTransaction: (signer: Wallet) => 
    sendTransaction(signer, getCalls(item.contractAddress)),
}))
