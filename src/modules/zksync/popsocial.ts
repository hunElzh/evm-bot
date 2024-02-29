import 'dotenv/config'
import { constants } from 'ethers'
import { Contract } from 'zksync-web3'
import { estimateGasFee, sendTransaction } from '../../utils'
import ABI from '../../abi/zksync/popsocial/abi.json'
import type { Wallet } from 'zksync-web3'

function getCalls() {
  return {
    contract: new Contract('0xE99950284Fb6E9E7682611967e7EC8EBB6Ec3907', ABI),
    functionName: 'setApprovalForAll',
    args: [constants.AddressZero, true],
  }
}

export default {
  title: 'Pop Social',
  description: '授权 NFT',
  value: 'popsocial',
  estimateGasFee: (signer: Wallet) => estimateGasFee(signer, getCalls()),
  sendTransaction: (signer: Wallet) => sendTransaction(signer, getCalls()),
}
