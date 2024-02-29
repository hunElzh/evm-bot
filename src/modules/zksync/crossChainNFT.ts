import 'dotenv/config'
import { constants } from 'ethers'
import { Contract } from 'zksync-web3'
import { estimateGasFee, sendTransaction } from '../../utils'
import ABI from '../../abi/zksync/crossChainNFT/abi.json'
import type { Wallet } from 'zksync-web3'

function getCalls() {
  return {
    contract: new Contract('0x31DCD96f29BD32F3a1856247846E9d2f95C2b639', ABI),
    functionName: 'setApprovalForAll',
    args: [constants.AddressZero, true],
  }
}

export default {
  title: 'Cross Chain NFT',
  description: '授权 NFT',
  value: 'crossChainNFT',
  estimateGasFee: (signer: Wallet) => estimateGasFee(signer, getCalls()),
  sendTransaction: (signer: Wallet) => sendTransaction(signer, getCalls()),
}
