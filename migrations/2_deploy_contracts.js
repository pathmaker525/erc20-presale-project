const RE_Token = artifacts.require("RE_Token")
const RE_Presale = artifacts.require("RE_PreSale")

module.exports = async (deployer) => {
  let addr = await web3.eth.getAccounts()

  // Deploy Real Estate Demo Token with no constructor parameters
  await deployer.deploy(RE_Token)

  // Deploy Real Estate Demo PreSale with rate 1, owner address, IERC20 token
  await deployer.deploy(
    RE_Presale,
    1 /* _rate */,
    addr[0] /* _wallet */,
    RE_Token.address /* IERC20 Token Contract */
  )
}
