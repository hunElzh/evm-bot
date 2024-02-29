import 'dotenv/config'
import { constants } from 'ethers'
import { Contract } from 'zksync-web3'
import { estimateGasFee, sendTransaction } from '../../utils'
import NFT_ABI from '../../abi/zksync/tavaera/nft.json'
import ID_ABI from '../../abi/zksync/tavaera/id.json'
import type { Wallet } from 'zksync-web3'

const NFT_CONTRACT_ADDRESS = '0x50b2b7092bcc15fbb8ac74fe9796cf24602897ad'
const ID_CONTRACT_ADDRESS = '0xd29Aa7bdD3cbb32557973daD995A3219D307721f'

function getCalls(contractAddress: string, abi: any) {
  return {
    contract: new Contract(contractAddress, abi),
    functionName: 'setApprovalForAll',
    args: [constants.AddressZero, true],
  }
}

export const tavaeraNFT = {
  title: 'Tavaera NFT',
  description: '授权 NFT',
  value: 'tavaeraNFT',
  estimateGasFee: (signer: Wallet) =>
    estimateGasFee(signer, getCalls(NFT_CONTRACT_ADDRESS, NFT_ABI)),
  sendTransaction: (signer: Wallet) =>
    sendTransaction(signer, getCalls(NFT_CONTRACT_ADDRESS, NFT_ABI)),
}

export const tavaeraID = {
  title: 'Tavaera ID',
  description: '授权 NFT',
  value: 'tavaeraID',
  estimateGasFee: (signer: Wallet) =>
    estimateGasFee(signer, getCalls(ID_CONTRACT_ADDRESS, ID_ABI)),
  sendTransaction: (signer: Wallet) =>
    sendTransaction(signer, getCalls(ID_CONTRACT_ADDRESS, ID_ABI)),
}
