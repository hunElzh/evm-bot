import { ethers } from 'ethers';
import { contract, rpc } from '../../../constants';
import ABI from '../../../abi/zkevm/crossChainNft/abi.json'
import { estimateGasFee, getProvider, sendTransaction } from '../../../utils';
import { Calls } from '../../../types';
import { Wallet } from 'zksync-web3';


function getCalls(): Calls {
  const provider = getProvider(rpc.POLYGON_ZKEVM);
  const contractInstance = new ethers.Contract(contract.POLY_ZKEVM.CROSSCHAINNFT, ABI, provider);
  const functionName = 'mint';
  const args: any[] = [];
  const options = {
    gasLimit: ethers.utils.parseEther('0.01')
  }
  return {
    contract: contractInstance,
    functionName: functionName,
    args: args,
    options: options
  }
}

export default {
  title: 'CrossChainNft-Mint',
  description: `MintNft`,
  value: 'crossChainNft-Mint',
  estimateGasFee: (signer: Wallet) => estimateGasFee(signer, getCalls()),
  sendTransaction: (signer: Wallet) => sendTransaction(signer, getCalls()),
}

