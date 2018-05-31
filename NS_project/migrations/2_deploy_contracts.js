var Renting = artifacts.require("./Renting.sol");
var Notary = artifacts.require("./Notary.sol");
module.exports = function(deployer) {
deployer.deploy(Notary);
  deployer.deploy(Renting);

}
