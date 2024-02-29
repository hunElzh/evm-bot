import 'dotenv/config'
import { constants } from 'ethers'
import { Contract } from 'zksync-web3'
import { estimateGasFee, sendTransaction } from '../../utils'
import ABI from '../../abi/zksync/crossChainNFT/abi.json'
import type { Wallet } from 'zksync-web3'

function getCalls() {
  return {
    contract: new Contract(
      process.env.NETWORK === 'mainnet'
        ? '0x996A719fbc67f35a4344f73890C1172eb194A88c'
        : '0x8f38FfE39EBC1fCEd6bF29373E0fE56Dc88B4348',
      ABI,
    ),
    functionName: 'setApprovalForAll',
    args: [constants.AddressZero, true],
  }
}

export default {
  title: 'NFTs2Me',
  description: '授权 NFT',
  value: 'nfts2me',
  estimateGasFee: (signer: Wallet) => estimateGasFee(signer, getCalls()),
  sendTransaction: (signer: Wallet) => sendTransaction(signer, getCalls()),
}
