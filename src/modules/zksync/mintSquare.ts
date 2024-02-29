import 'dotenv/config'
import { constants } from 'ethers'
import { Contract } from 'zksync-web3'
import { estimateGasFee, sendTransaction } from '../../utils'
import ABI from '../../abi/zksync/mintSquare/abi.json'
import type { Wallet } from 'zksync-web3'

function getCalls() {
  return {
    contract: new Contract('0x53eC17BD635F7A54B3551E76Fd53Db8881028fC3', ABI),
    functionName: 'setApprovalForAll',
    args: [constants.AddressZero, false],
  }
}

export default {
  title: 'MintSquare',
  description: '授权 NFT',
  value: 'mintSquare',
  estimateGasFee: (signer: Wallet) => estimateGasFee(signer, getCalls()),
  sendTransaction: (signer: Wallet) => sendTransaction(signer, getCalls()),
}
