import { BigNumber, ethers } from 'ethers'
import { estimateGasFee, getProvider, sendTransaction } from '../../../utils'
import { contract, rpc } from '../../../constants'
import ABI from '../../../abi/zkevm/keom/abi.json'
import { Calls } from '../../../types'
import { Wallet } from 'zksync-web3'

const getCalls = (): Calls => {
  const contractInstance = new ethers.Contract(contract.POLY_ZKEVM.KEOM.ROUTER, ABI)
  const args = [BigNumber.from(0)]
  const options = {
    gasLimit: ethers.utils.parseEther('0.01')
  }
  return {
    contract: contractInstance,
    functionName: 'repayBorrow',
    args: args,
    options: options,
  }
}

export default {
  title: 'KeomRepayBorrow',
  description: `返还usdt`,
  value: 'keomRepayBorrow',
  estimateGasFee: (signer: Wallet) => estimateGasFee(signer, getCalls()),
  sendTransaction: (signer: Wallet) => sendTransaction(signer, getCalls()),
}
