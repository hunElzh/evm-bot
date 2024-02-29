import pancakeswap from './pancakeswap/pancakeswap'
import satoriDeposit from './satori/satoriDeposit'
import keomDeposit from './keom/keomDeposit'
import keomBorrow from './keom/keomBorrow'
import keomRepayBorrow from './keom/keomRepayBorrow'
import keomWithDraw from './keom/keomWithdraw'
import mintCrossChainNFT from './crossChainNft/mintNft'
import approveAllNft from './crossChainNft/approve'
import erc20Approval from './erc20-approval'
import erc721Approval from './erc721-approval'

export default [
  // pancakeswap,
  // satoriDeposit,
  keomDeposit,
  keomBorrow,
  keomRepayBorrow,
  keomWithDraw,
  mintCrossChainNFT,
  approveAllNft,
  ...erc20Approval,
  ...erc721Approval
].sort((a, b) => a.value.localeCompare(b.value))
