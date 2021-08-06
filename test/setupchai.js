const BN = web3.utils.BN

const chai = require("chai")
const chaiBN = require("chai-bn")(BN)
const chaiAsPromised = require("chai-as-promised")
const { solidity } = require("ethereum-waffle")

chai.should()
chai.use(chaiBN)
chai.use(chaiAsPromised)
chai.use(solidity)

module.exports = chai
