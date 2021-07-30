require("dotenv").config({ path: "./.env" })
const HDWalletProvider = require("@truffle/hdwallet-provider")

//
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "5777", // Any network (default: none)
    },
    bsc: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNEMONIC,
          "https://data-seed-prebsc-1-s1.binance.org:8545"
        ),
      gas: 550000,
      network_id: 97,
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: "0.8.6", // Fetch exact version from solc-bin (default: truffle's version)
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
  chai: {
    enableTimeouts: false,
  },
}
