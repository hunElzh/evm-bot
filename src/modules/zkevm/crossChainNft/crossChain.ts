import { BigNumber, ethers } from 'ethers';
import { contract, rpc } from '../../../constants';
import ABI from '../../../abi/zkevm/crossChainNft/abi.json'
import { estimateGasFee, getProvider, sendTransaction } from '../../../utils';
import { Calls } from '../../../types';
import { Wallet } from 'zksync-web3';

function getArgs() {
  const ethers = BigNumber.from(0)
  const chainId = 1; // 改成手动选择
  const tokenId = 1;
}


function getCalls(): Calls {
  const provider = getProvider(rpc.POLYGON_ZKEVM);
  const contractInstance = new ethers.Contract(contract.POLY_ZKEVM.CROSSCHAINNFT, ABI, provider);
  const functionName = 'crossChain';
  const args = [BigNumber.from(0), 1, 'tokenId'];
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
  title: 'CrossChainNft-CrossChain',
  description: `CrossChain`,
  value: 'crossChainNft-Mint-CrossChain',
  estimateGasFee: (signer: Wallet) => estimateGasFee(signer, getCalls()),
  sendTransaction: (signer: Wallet) => sendTransaction(signer, getCalls()),
}

