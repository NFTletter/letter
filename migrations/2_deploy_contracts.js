const Letter = artifacts.require("Letter");

module.exports = function(deployer) {
  deployer.deploy(Letter);
};
