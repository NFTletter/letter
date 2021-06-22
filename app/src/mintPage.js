const { ethers } = require("ethers");
import letterABI from "../../data/abi/LetterABI.json";

let Letter;
let letter;

const App = {
  provider: null,
  signer: null,

  start: async function () {
  },

  mintPage: async function () {

    const contractAddr = document.getElementById("contractAddr").value;

    if (!ethers.utils.isAddress(contractAddr)) {
        window.alert("error: invalid Address... Make sure there's no extra spaces on the input field");
        return;
    }

    //  max 8192 chars
    const page = document.getElementById("pageBody").value;
    if (page.length == 0) {
        window.alert("error: Cannot mint empty Page.");
        return;
    }
    if (page.length > 8192) {
      window.alert("error: First Page must have maximum 8192 characters.");
      return;
    }

    try {
        Letter = new ethers.Contract(contractAddr, letterABI, this.provider);
    } catch (err) {
        window.alert("error: invalid Letter Contract Address");
        return;
    }

    letter = await Letter.deployed();
    const tx = await letter.connect(App.signer).mintPage(page);
    await tx.wait();

    const pageCount = await letter.connect(App.signer).viewPageCount();
    const pageTokenId = pageCount - 1;

    const status = document.getElementById("status");
    status.innerHTML = "Page Token Id: " + pageTokenId;

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