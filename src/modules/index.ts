import zksync from './zksync'
import zkevm from './zkevm'

const chainModule = {
  zksync: zksync,
  zkevm: zkevm
}

export function getModuleByChainId(chainId: number) {
  switch(chainId) {
    case 1101:
      return zkevm;
    case 324:
      return zksync;
    default:
      return [];
  }
}

export default chainModule;
