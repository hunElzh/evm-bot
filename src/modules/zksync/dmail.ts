import 'dotenv/config'
import { Contract } from 'zksync-web3'
import { estimateGasFee, sendTransaction } from '../../utils'
import ABI from '../../abi/zksync/dmail/abi.json'
import type { Wallet } from 'zksync-web3'

function getCalls(address: string) {
  return {
    contract: new Contract('0x981F198286E40F9979274E0876636E9144B8FB8E', ABI),
    functionName: 'send_mail',
    args: [`${address}@dmail.ai`, 'dmailteam@dmail.ai'],
  }
}

export default {
  title: 'Dmail',
  description: '向 dmailteam@dmail.ai 发送邮件',
  value: 'dmail',
  estimateGasFee: (signer: Wallet) =>
    estimateGasFee(signer, getCalls(signer.address)),
  sendTransaction: (signer: Wallet) =>
    sendTransaction(signer, getCalls(signer.address)),
}
