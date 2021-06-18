const Letter = artifacts.require("Letter");
const LetterFactory = artifacts.require("LetterFactory");

module.exports = function(deployer) {
  deployer.deploy(Letter);
  deployer.deploy(LetterFactory);
};
