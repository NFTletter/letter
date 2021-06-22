const { ethers } = require("ethers");
import letterFactoryABI from "../../test/LetterFactoryABI.json";

const letterFactoryAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

let LetterFactory;
let letterFactory;

const App = {
  provider: null,
  signer: null,

  start: async function () {

    try {
      LetterFactory = new ethers.Contract(letterFactoryAddress, letterFactoryABI, this.provider);
      letterFactory = await LetterFactory.deployed();

    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  createLetter: async function () {
    const createdLetter = document.getElementById("createdLetter");
    createdLetter.innerHTML = "";
    return;
  }

};

window.App = App;

window.addEventListener("load", async function () {

  await window.ethereum.enable();

  // use MetaMask's provider
  App.provider = new ethers.providers.Web3Provider(window.ethereum);

  // load MetaMask account
  App.signer = App.provider.getSigner();

  App.start();
});