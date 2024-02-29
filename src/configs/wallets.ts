import type { WalletConfig } from '../types'

export const wallets: WalletConfig[] = [
  
]

export const resolvedWallets: WalletConfig[] = wallets.map((wallet, index) => ({
  label: `Account ${index + 1}`,
  ...wallet,
}))
