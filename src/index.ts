import c from 'picocolors'
import prompts from 'prompts'
import { Wallet } from 'zksync-web3'
import {
  generateWalletTitle,
  getLatestTransactionAge,
  getProvider,
} from './utils'
import { resolvedWallets } from './configs/wallets'
import modules, { getModuleByChainId } from './modules'
import type { Provider } from 'zksync-web3'
import type { ChainConfig, WalletConfig } from './types'
import { chain } from './constants'
import { getDomainByChainId } from './constants/domain'

let currentModules: any[];
let provider: Provider;
let currentChain: ChainConfig;

async function init() {
  // 1. 初始化chain
  const chainChoice = chain.map(c => {
    return {
      title: c.label,
      value: c
    }
  })
  const { chain: c } = await prompts({
    type: 'select',
    name: 'chain',
    message: '请选择交互链',
    choices: chainChoice
  })
  currentChain = c
  
  // 2. 根据chain初始化provider
  provider = getProvider(currentChain.rpcUrl)

  // 3. 初始化currentModule
  currentModules = getModuleByChainId(currentChain.chainId)
  if(currentModules.length == 0) {
    throw new Error('currentChain has no project')
  }
}

async function _getConfig() {
  const input = process.argv.slice(2)

  let wallets = resolvedWallets.filter(
    (w) => input[0]?.split(',').includes(w.address),
  )

  if (wallets.length) {
    console.log(
      `${c.green('✔')} ${c.bold('请选择交互交互的钱包')} ${c.dim(
        '›',
      )} ${c.bold(
        wallets.map((w) => generateWalletTitle(w.address)).join(', '),
      )}`,
    )
  } else {
    const choices = await Promise.all(
      resolvedWallets.map(async (wallet) => {
        const age = await getLatestTransactionAge(wallet.address)
        return {
          title: `${generateWalletTitle(wallet.address)} ${age}`,
          value: wallet,
        }
      }),
    )
    const { wallets: w } = await prompts({
      type: 'multiselect',
      name: 'wallets',
      message: '请选择交互的钱包',
      choices: choices,
      instructions: false,
    })
    wallets = w
  }

  let project = currentModules.find((m) => m.value === input[1])?.value

  if (project) {
    console.log(
      `${c.green('✔')} ${c.bold('请选择交互的项目')} ${c.dim('›')} ${c.bold(
        currentModules.find((m) => m.value === input[1])?.title,
      )}`,
    )
  } else {
    const { project: p } = await prompts({
      type: 'select',
      name: 'project',
      message: '请选择交互的项目',
      choices: currentModules,
    })
    project = p
  }

  return { wallets, project }
}

async function _beforeSubmitTransaction(
  provider: Provider,
  wallet: WalletConfig,
  module: (typeof currentModules)[0],
) {
  const signer = new Wallet(wallet.privateKey, provider)
  const fee = await module.estimateGasFee(signer)
  if (process.env.TRANSACTION_CONFIRM === 'true') {
    const { value } = await prompts({
      type: 'confirm',
      name: 'value',
      message: `预估手续费: ${c.yellow(`$${fee}`)}, 确认交易吗?`,
      initial: true,
    })
    return value
  }
  console.log(`\n${c.bold('预估手续费: ')}${c.yellow(`$${fee}`)}\n`)
  return true
}

async function run() {
  await init();
  const { wallets, project } = await _getConfig()
  const module = currentModules.find((m) => m.value === project)!

  const isSubmit = await _beforeSubmitTransaction(provider, wallets[0], module)

  if (!isSubmit) return

  const promises = wallets.map(async (wallet) => {
    const signer = new Wallet(wallet.privateKey, provider)
    return module.sendTransaction(signer)
  })

  let res = await Promise.all(promises);

  res
    .flat()
    .filter(Boolean)
    .forEach((r: any) => {
      console.log(
        `\n${c.bold(generateWalletTitle(r!.address))}\n${c.bold(
          'Nonce: ',
        )}${c.yellow(r!.nonce.toString())}\n${c.bold('Transaction: ')}${c.green(
          `${getDomainByChainId(currentChain.chainId)}tx/${r!.tx}`,
        )}\n`,
      )
    })
}

run()
