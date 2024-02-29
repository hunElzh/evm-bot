import { ChainConfig } from '../types';
import { rpcs } from './rpc'

export const chainList: ChainConfig[] = [
  {
    chainId: 1101,
    rpcUrl: rpcs.POLYGON_ZKEVM,
    label: 'POLYGON_ZKEVM'
  },{
    chainId: 324,
    rpcUrl: rpcs.ZKSYNC_ERA,
    label: 'ZKSYNC_ERA'
  },{
    chainId: 324,
    rpcUrl: rpcs.ZKSYNC_ERA,
    label: 'ZKSYNC_ERA'
  },{
    chainId: 1,
    rpcUrl: rpcs.ETHEREUM,
    label: 'ETHEREUM'
  },{
    chainId: 42161,
    rpcUrl: rpcs.ARBITRUM,
    label: 'ARBITRUM'
  },{
    chainId: 59144,
    rpcUrl: rpcs.LINEA,
    label: 'LINEA'
  },{
    chainId: 10,
    rpcUrl: rpcs.OPTIMISM,
    label: 'OPTIMISM'
  }
]
