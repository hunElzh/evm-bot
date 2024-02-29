import { ChainConfig } from '../types';

export const domains = {
  ZKSYNC:
    process.env.NETWORK === 'mainnet'
      ? 'https://explorer.zksync.io/'
      : 'https://goerli.explorer.zksync.io/tx/',
  POLYGON_ZKEVM:
    process.env.NETWORK === 'mainnet'
      ? 'https://zkevm.polygonscan.com/'
      : '',
}

export function getDomainByChainId(chainId: number) {
  switch(chainId){
    case 1101:
      return domains.POLYGON_ZKEVM
    case 324:
      return domains.ZKSYNC
    default:
      null;
  }
}
