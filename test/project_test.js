const Token = artifacts.require("RE_Token")
const PreSale = artifacts.require("RE_PreSale")

const { expect, assert } = require("./setupchai.js")
const BN = web3.utils.BN

const {
  ether,
  transferOwnership,
  expectInvalidOpcode,
  makeTransaction,
} = require("./helpers.js")

require("dotenv").config({ path: "./.env" })

contract("Real Estate Project Test", async (accounts) => {
  const [investor, receiver, receiver_2, hacker_1, hacker_2] = accounts

  console.log("Investor: ", investor)
  console.log("Receiver: ", receiver)
  console.log("Token Address:", Token.address)
  console.log("Presale Address:", PreSale.address)

  const investment = ether(10)
  const smallInvestment = ether(0.5)
  const hugeInvestment = ether(100)
  const softCap = ether(2500)
  const hardCap = ether(4000)
  const transfer = new BN(150000000000000)
  const newRate = 10
  const poolPercentage = 5

  beforeEach(async () => {
    this.token = await Token.new()
    this.presale = await PreSale.new(5, investor, this.token.address)
    this.owner = await this.presale.owner.call()
  })

  describe("Ownership", async () => {
    it("should initially belong to contract caller", async () => {
      console.log(this.token.address, this.presale.address)
      assert.equal(this.owner, investor)
    })
    it("should be transferable to another account", async () => {
      console.log(this.token.address, this.presale.address)
      await transferOwnership(this.presale, this.owner, receiver)
      const newOwner = await this.presale.owner.call()
      assert.equal(receiver, newOwner)
    })
    it("should not be transferable by non-owner", async () => {
      console.log(this.token.address, this.presale.address)
      await expectInvalidOpcode(
        transferOwnership(this.presale, hacker_1, hacker_2)
      )
      const newOwner = await this.presale.owner.call()
      return assert.equal(this.owner, newOwner)
    })
  })

  describe("Tokens", async () => {
    it("all should initially be in owners account", async () => {
      console.log(this.token.address, this.presale.address)
      await expect(
        this.token.balanceOf(investor)
      ).to.eventually.be.a.bignumber.equal(await this.token.totalSupply())
    })
    it("transfer to or from blacklisted address will be rejected", async () => {
      console.log(this.token.address, this.presale.address)
      await expect(this.token.setAddressAsBlacklisted(hacker_1)).to.eventually
        .be.fulfilled
      await expect(this.token.transfer(hacker_1, transfer)).to.eventually.be
        .rejected
    })
    it("transfer to or from whitelisted address will be fulfilled", async () => {
      console.log(this.token.address, this.presale.address)
      await expect(this.token.setAddressAsWhitelisted(receiver)).to.eventually
        .be.fulfilled
      await expect(this.token.transfer(receiver, transfer)).to.eventually.be
        .fulfilled
      await expect(this.token.transfer(receiver_2, transfer)).to.eventually.be
        .rejected
    })
    it("should be able to transfer between accounts", async () => {
      console.log(this.token.address, this.presale.address)
      await expect(this.token.setAddressAsWhitelisted(receiver)).to.eventually
        .be.fulfilled
      await expect(this.token.transfer(receiver, transfer)).to.eventually.be
        .fulfilled
      await expect(
        this.token.balanceOf(receiver)
      ).to.eventually.be.a.bignumber.equal(transfer)
    })
    it("transfer exceed total amount should be rejected", async () => {
      console.log(this.token.address, this.presale.address)
      await expect(
        this.token.transfer(
          receiver,
          new BN((await this.token.totalSupply()) + 1)
        )
      ).to.eventually.be.rejected
    })
  })

  describe("Pre-Sale", async () => {
    it("ICO starts", async () => {
      console.log(this.token.address, this.presale.address)
      const tTotal = await this.token.totalSupply()
      await expect(
        this.presale.startICO(
          1630376078,
          smallInvestment,
          hugeInvestment,
          tTotal,
          softCap,
          hardCap,
          poolPercentage
        )
      ).to.eventually.be.fulfilled
    })
    // This features needs to be tested on Kovan Testnet because this one include SWAP feature.
    // it("should allow admin to stop ICO", async () => {
    //   const tTotal = await this.token.totalSupply()
    //   await expect(
    //     this.presale.startICO(
    //       1630376078,
    //       smallInvestment,
    //       hugeInvestment,
    //       tTotal,
    //       softCap,
    //       hardCap
    //     )
    //   ).to.eventually.be.fulfilled

    //   await expect(this.presale.stopICO()).to.eventually.be.fulfilled
    // })
    it("should allow admin to reset Rate", async () => {
      console.log(this.token.address, this.presale.address)
      const tTotal = await this.token.totalSupply()
      await expect(
        this.presale.startICO(
          1630376078,
          smallInvestment,
          hugeInvestment,
          tTotal,
          softCap,
          hardCap,
          poolPercentage
        )
      ).to.eventually.be.fulfilled

      await expect(this.presale.setRate(newRate)).to.eventually.be.fulfilled
      await expect(this.presale.getRate()).to.be.eventually.be.equal(newRate)
    })
  })
})
