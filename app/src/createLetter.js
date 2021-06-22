const { ethers } = require("ethers");
import letterFactoryABI from "../../data/abi/LetterFactoryABI.json";

const letterFactoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

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

    // max 64 chars
    const title = document.getElementById("title").value;
    if (title.length > 64) {
      window.alert("error: Tile must have maximum 64 characters.");
      return;
    }

    //  max 8192 chars
    const firstPage = document.getElementById("firstPage").value;
    if (firstPage.length > 8192) {
      window.alert("error: First Page must have maximum 8192 characters.");
      return;
    }

    // max 64 chars
    const author = document.getElementById("author").value;
    if (author.length > 64) {
      window.alert("error: Author must have maximum 64 characters.");
      return;
    }

    const tx = await letterFactory.connect(App.signer).createLetter(title, firstPage, author);
    const { events } = await tx.wait();
    const { address } = events.find(Boolean);
    const addr = ethers.utils.getAddress(address);

    const createdLetter = document.getElementById("createdLetter");
    createdLetter.innerHTML = "Letter Contract Address: " + addr;

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