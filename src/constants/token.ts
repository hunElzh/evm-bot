export const tokens = {
  ETH: {
    ETHEREUM:
      process.env.NETWORK === 'mainnet'
        ? '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        : '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
    ZKSYNC_ERA:
      process.env.NETWORK === 'mainnet'
        ? '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91'
        : '0x20b28b1e4665fff290650586ad76e977eab90c5d',
    ARBITRUM:
      process.env.NETWORK === 'mainnet'
        ? '0x82af49447d8a07e3bd95bd0d56f35241523fbab1'
        : '0xe39ab88f8a4777030a534146a9ca3b52bd5d43a3',
    OPTIMISM:
      process.env.NETWORK === 'mainnet'
        ? '0x4200000000000000000000000000000000000006'
        : '0x4200000000000000000000000000000000000006',
    LINEA:
      process.env.NETWORK === 'mainnet'
        ? '0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f'
        : '0x2C1b868d6596a18e32E61B901E4060C872647b6C',
    POLYGON_ZKEVM:
      process.env.NETWORK === 'mainnet'
        ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        : '',
  },
  USDC: {
    ETHEREUM:
      process.env.NETWORK === 'mainnet'
        ? '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
        : '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
    ZKSYNC_ERA:
      process.env.NETWORK === 'mainnet'
        ? '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4'
        : '0x0faf6df7054946141266420b43783387a78d82a9',
    ARBITRUM:
      process.env.NETWORK === 'mainnet'
        ? '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8'
        : '0x8fb1e3fc51f3b789ded7557e680551d93ea9d892',
    OPTIMISM:
      process.env.NETWORK === 'mainnet'
        ? '0x7f5c764cbc14f9669b88837ca1490cca17c31607'
        : '0x7e07e15d2a87a24492740d16f5bdf58c16db0c4e',
    LINEA:
      process.env.NETWORK === 'mainnet'
        ? '0x176211869ca2b568f2a7d4ee941e073a821ee1ff'
        : '0xf56dc6695cf1f5c364edebc7dc7077ac9b586068',
    POLYGON_ZKEVM:
      process.env.NETWORK === 'mainnet'
        ? '0xA8CE8aee21bC2A48a5EF670afCc9274C7bbbC035'
        : '',
  },
  USDT: {
    ETHEREUM: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    ZKSYNC_ERA:
      process.env.NETWORK === 'mainnet'
        ? '0x493257fd37edb34451f62edf8d2a0c418852ba4c'
        : '0xfced12debc831d3a84931c63687c395837d42c2b',
    ARBITRUM: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
    OPTIMISM: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
    LINEA: '0xa219439258ca9da29e9cc4ce5596924745e12b93',
    POLYGON_ZKEVM: '0x1E4a5963aBFD975d8c9021ce480b42188849D41d',
  },
}
