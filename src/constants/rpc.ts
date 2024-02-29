

export const rpcs = {
  ETHEREUM:
    process.env.NETWORK === 'mainnet'
      ? 'https://mainnet.infura.io/v3/533dfd23557045fdb3700f2e4331f0b7'
      : 'https://goerli.infura.io/v3/533dfd23557045fdb3700f2e4331f0b7',
  ZKSYNC_ERA:
    process.env.NETWORK === 'mainnet'
      ? 'https://mainnet.era.zksync.io'
      : 'https://testnet.era.zksync.dev',
  ARBITRUM:
    process.env.NETWORK === 'mainnet'
      ? 'https://arbitrum-mainnet.infura.io/v3/533dfd23557045fdb3700f2e4331f0b7'
      : 'https://arbitrum-goerli.infura.io/v3/533dfd23557045fdb3700f2e4331f0b7',
  OPTIMISM:
    process.env.NETWORK === 'mainnet'
      ? 'https://optimism-mainnet.infura.io/v3/533dfd23557045fdb3700f2e4331f0b7'
      : 'https://optimism-goerli.infura.io/v3/533dfd23557045fdb3700f2e4331f0b7',
  LINEA:
    process.env.NETWORK === 'mainnet'
      ? 'https://linea-mainnet.infura.io/v3/533dfd23557045fdb3700f2e4331f0b7'
      : 'https://linea-goerli.infura.io/v3/533dfd23557045fdb3700f2e4331f0b7',
  POLYGON_ZKEVM:
    process.env.NETWORK === 'mainnet'
      ? 'https://rpc.ankr.com/polygon_zkevm'
      : 'https://rpc.ankr.com/polygon_zkevm_testnet',
  OPBNB:
      process.env.NETWORK === 'mainnet'
      ? 'https://opbnb-mainnet-rpc.bnbchain.org'
      : 'https://rpc.ankr.com/polygon_zkevm_testnet',
}
