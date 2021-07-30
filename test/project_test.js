const RE_Token = artifacts.require("RE_Token")
const RE_PreSale = artifacts.require("RE_PreSale")

const chai = require("./setupchai.js")
const BN = web3.utils.BN
const expect = chai.expect

const helper = require("./helpers.js")
const ether = helper.ether
const getBalance = helper.getBalance

require("dotenv").config({ path: "./.env" })

contract("Real Estate Token Test", async (accounts) => {
  const [investor, receiver, hacker] = accounts

  const investment = ether(10)
  const smallInvestment = ether(0.5)
  const hugeInvestment = ether(100)

  console.log("Investor: ", investor)
  console.log("Receiver: ", receiver)

  beforeEach(async () => {
    this.token = await RE_Token.new()
    this.presale = await RE_Presale.new(5, investor, this.token.address)
    this.owner = await this.presale.owner.call()
    this.wallet = await this.presale.wallet.call()
  })
  // beforeEach(async () => {
  //   console.log(deployerAccount)
  //   console.log(recipient)
  //   this.token = await RE_Token.new()
  // })

  // it("All tokens should be in my account", async () => {
  //   const instance = this.testToken
  //   const totalSupply = await instance.totalSupply()

  //   return expect(
  //     instance.balanceOf(deployerAccount)
  //   ).to.eventually.be.a.bignumber.equal(totalSupply)
  // })

  // it("Token transfer between accounts is possible", async () => {
  //   const sendTokens = 10
  //   const instance = this.testToken
  //   const totalSupply = await instance.totalSupply()

  //   await expect(
  //     instance.balanceOf(deployerAccount)
  //   ).to.eventually.be.a.bignumber.equal(totalSupply)
  //   await expect(instance.transfer(recipient, new BN(sendTokens))).to.eventually
  //     .be.fulfilled
  //   await expect(
  //     instance.balanceOf(deployerAccount)
  //   ).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)))
  //   return await expect(
  //     instance.balanceOf(recipient)
  //   ).to.eventually.be.a.bignumber.equal(new BN(sendTokens))
  // })

  // it("Token transfer over total amount will be rejected", async () => {
  //   const instance = this.testToken
  //   const balanceOfDeployer = await instance.balanceOf(deployerAccount)

  //   expect(instance.transfer(recipient, new BN(balanceOfDeployer + 1))).to
  //     .eventually.be.rejected
  //   return expect(
  //     instance.balanceOf(deployerAccount)
  //   ).to.eventually.be.a.bignumber.equal(balanceOfDeployer)
  // })

  // it("Token transfer to or from blacklisted address will be rejected", async () => {
  //   console.log(botAddress)
  //   const instance = this.testToken
  //   const sendTokens = 10

  //   await expect(instance.setAddressAsBlacklisted(botAddress)).to.eventually.be
  //     .fulfilled
  //   await expect(instance.transfer(botAddress, new BN(sendTokens))).to
  //     .eventually.be.rejected
  // })
})
