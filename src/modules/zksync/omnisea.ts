import 'dotenv/config'
import { Contract } from 'zksync-web3'
import { estimateGasFee, sendTransaction } from '../../utils'
import ABI from '../../abi/zksync/omnisea/abi.json'
import type { Wallet } from 'zksync-web3'

function generateCollectionData() {
  const title = Array.from(
    { length: Math.floor(Math.random() * 11) + 5 },
    (_, i) => String.fromCharCode(97 + i),
  )
    .sort(() => Math.random() - 0.5)
    .join('')
  const symbol = Array.from(
    { length: Math.floor(Math.random() * 4) + 3 },
    (_, i) => String.fromCharCode(65 + i),
  )
    .sort(() => Math.random() - 0.5)
    .join('')
  return { title, symbol }
}

async function getCalls() {
  const { title, symbol } = await generateCollectionData()

  return {
    contract: new Contract('0x1Ecd053f681a51E37087719653f3f0FFe54750C0', ABI),
    functionName: 'create',
    args: [
      [
        title,
        symbol,
        '',
        '',
        0,
        true,
        0,
        Math.floor(Date.now() / 1000) + 1000000,
      ],
    ],
  }
}

export default {
  title: 'Omnisea',
  description: '创建 NFT 合集',
  value: 'omnisea',
  estimateGasFee: async (signer: Wallet) =>
    estimateGasFee(signer, await getCalls()),
  sendTransaction: async (signer: Wallet) =>
    sendTransaction(signer, await getCalls()),
}
