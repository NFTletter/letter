const { ethers } = require("ethers");
import letterABI from "../data/abi/LetterABI.json";

let letter;

const App = {
  provider: null,
  signer: null,

  start: async function () {
  },

  open: async function () {

    const contractAddr = document.getElementById("contractAddr").value;

    if (!ethers.utils.isAddress(contractAddr)) {
        window.alert("error: invalid Address... Make sure there's no extra spaces on the input field");
        return;
    }

    try {
        letter = new ethers.Contract(contractAddr, letterABI, this.provider);
    } catch (err) {
        window.alert("error: invalid Letter Contract Address");
        return;
    }

    if (await letter.connect(App.signer).owner() != await App.signer.getAddress()){
      window.alert("error: you must be the Letter Contract Owner");
      return;
    }

    await letter.connect(App.signer).open();

    const openStatus = document.getElementById("openStatus");
    openStatus.innerHTML = "<b>Open Letter</b>";

    return;
  },

  close: async function () {

    const contractAddr = document.getElementById("contractAddr").value;

    if (!ethers.utils.isAddress(contractAddr)) {
        window.alert("error: invalid Contract Address... Make sure there's no extra spaces on the input field");
        return;
    }

    try {
        letter = new ethers.Contract(contractAddr, letterABI, this.provider);
    } catch (err) {
        window.alert("error: invalid Letter Contract Address");
        return;
    }

    if (await letter.connect(App.signer).owner() != await App.signer.getAddress()){
      window.alert("error: you must be the Letter Contract Owner");
      return;
    }

    await letter.connect(App.signer).close();

    const openStatus = document.getElementById("openStatus");
    openStatus.innerHTML = "<b>Closed Letter</b>";

    return;
  },

  addReader: async function () {

    const contractAddr = document.getElementById("contractAddr").value;

    if (!ethers.utils.isAddress(contractAddr)) {
        window.alert("error: invalid Contract Address... Make sure there's no extra spaces on the input field");
        return;
    }

    const readerAddr = document.getElementById("readerAddr").value;

    if (!ethers.utils.isAddress(readerAddr)) {
        window.alert("error: invalid Reader Address... Make sure there's no extra spaces on the input field");
        return;
    }

    try {
        letter = new ethers.Contract(contractAddr, letterABI, this.provider);
    } catch (err) {
        window.alert("error: invalid Letter Contract Address");
        return;
    }

    if (await letter.connect(App.signer).owner() != await App.signer.getAddress()){
      window.alert("error: you must be the Letter Contract Owner");
      return;
    }

    await letter.connect(App.signer).addReader(readerAddr);

    const readerStatus = document.getElementById("readerStatus");
    readerStatus.innerHTML = readerAddr + "<b> is Reader.</b>";

    return;
  },

  removeReader: async function () {

    const contractAddr = document.getElementById("contractAddr").value;

    if (!ethers.utils.isAddress(contractAddr)) {
        window.alert("error: invalid Contract Address... Make sure there's no extra spaces on the input field");
        return;
    }

    const readerAddr = document.getElementById("readerAddr").value;

    if (!ethers.utils.isAddress(readerAddr)) {
        window.alert("error: invalid Reader Address... Make sure there's no extra spaces on the input field");
        return;
    }

    try {
        letter = new ethers.Contract(contractAddr, letterABI, this.provider);
    } catch (err) {
        window.alert("error: invalid Letter Contract Address");
        return;
    }

    if (await letter.connect(App.signer).owner() != await App.signer.getAddress()){
      window.alert("error: you must be the Letter Contract Owner");
      return;
    }

    await letter.connect(App.signer).removeReader(readerAddr);

    const readerStatus = document.getElementById("readerStatus");
    readerStatus.innerHTML = readerAddr + "<b> is not Reader.</b>";

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