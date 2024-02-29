import { constants } from 'ethers';
import { Contract, Wallet } from 'zksync-web3';
import ABI from '../../../abi/zkevm/crossChainNft/abi.json'
import { estimateGasFee, sendTransaction } from '../../../utils';

function getCalls() {
  return {
    contract: new Contract('0x31DCD96f29BD32F3a1856247846E9d2f95C2b639', ABI),
    functionName: 'setApprovalForAll',
    args: [constants.AddressZero, true],
  }
}

export default {
  title: 'CrossChainNft-ApproveForAll',
  description: `CrossChain`,
  value: 'crossChainNft-Mint-ApproveForAll',
  estimateGasFee: (signer: Wallet) => estimateGasFee(signer, getCalls()),
  sendTransaction: (signer: Wallet) => sendTransaction(signer, getCalls()),
}

