const { ethers } = require("ethers");
import letterFactoryABI from "../data/abi/LetterFactoryABI.json";

let LetterFactory;

const App = {
  provider: null,
  signer: null,
  network: null,
  letterFactoryAddress: null,
  letterFactory: null,

  start: async function () {

    try {
      LetterFactory = new ethers.Contract(App.letterFactoryAddress, letterFactoryABI, this.provider);
      App.letterFactory = await LetterFactory.deployed();

    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  writeLetter: async function () {

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

    const writtenLetter = document.getElementById("writtenLetter");
    writtenLetter.innerHTML = "Writing Letter... please wait for Transaction to be mined.";

    const tx = await App.letterFactory.connect(App.signer).createLetter(title, firstPage, author);
    const { events } = await tx.wait();
    const { address } = events.find(Boolean);
    const addr = ethers.utils.getAddress(address);

    writtenLetter.innerHTML = "Letter Contract Address: <b>" + addr + "</b>";
    writtenLetter.innerHTML += "<br> Make sure you save it somewhere!";

    return;
  }

};

window.App = App;

window.addEventListener("load", async function () {

  await window.ethereum.enable();

  // use MetaMask's provider
  App.provider = new ethers.providers.Web3Provider(window.ethereum);

  // check network
  App.network = await App.provider.getNetwork();
  
  // letterFactory contract address
  if (App.network.name == "rinkeby") {
    App.letterFactoryAddress = "0x09291C6aC9E0b75FE68970C1Ad9883fD10b5180E";
  } else if (App.network.chainId == 31337) { // local Hardhat
    App.letterFactoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  } else if (App.network.chainId == 1287){ // moonbeam alpha
    App.letterFactoryAddress = "0xEAAfEd7caE3e329edd7A8b0a980b70E53c5784a9";
  } else {
    window.alert("error: no LetterFactory contract deployed in this network");
    return;
  }


  // load MetaMask account
  App.signer = App.provider.getSigner();

  App.start();
});
