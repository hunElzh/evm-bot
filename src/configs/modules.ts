import type { SwapConfig } from '../types'

export const swapConfig: SwapConfig = {
  from: 'ETH',
  to: 'USDC',
  minAmount: 0.0001,
  maxAmount: 0.0003,
  slippage: 0.2,
}
