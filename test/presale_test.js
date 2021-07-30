const RE_Presale = artifacts.require("RE_Presale")
const RE_Token = artifacts.require("RE_Token")

const chai = require("./setupchai.js")
const BN = web3.utils.BN
const expect = chai.expect

const ether = (n) => new web3.utils.BN(web3.utils.toWei(n.toString(), "ether"))

require("dotenv").config({ path: "./.env" })

contract("Real Estate Token Presale Test", async (accounts) => {
  const [deployerAccount, recipient, , presaleAccount] = accounts

  beforeEach(async () => {
    this.testToken = await RE_Token.new()
    this.testPresale = await RE_Presale.new(
      1,
      presaleAccount,
      this.testToken.address
    )
  })

  it("ICO should go live, User can buy token from ICO", async () => {
    const instance = this.testToken
    const presaleInstance = this.testPresale
    const endDate = 1727734086
    const _minPurchase = ether(1)
    const _maxPurchase = ether(10)
    const sendEth = ether(1)

    const _availableTokens = await instance.totalSupply()

    await expect(
      presaleInstance.startICO(
        endDate,
        new BN(_minPurchase),
        new BN(_maxPurchase),
        new BN(_availableTokens)
      )
    ).to.eventually.be.fulfilled
    await expect(
      presaleInstance.buyTokens(recipient, { from: recipient, value: sendEth })
    ).to.eventually.be.fulfilled
    return await expect(
      instance.balanceOf(recipient)
    ).to.be.eventually.be.a.bignumber.equal(new BN(1e18))
  })
})
