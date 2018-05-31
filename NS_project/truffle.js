module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    ganache: {
      host: 'localhost',
      port: 8545,
      network_id: "*" // Match any network id
    }
  }
};
