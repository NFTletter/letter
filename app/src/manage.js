const { ethers } = require("ethers");
import letterABI from "../../data/abi/LetterABI.json";

let letter;

const App = {
  provider: null,
  signer: null,

  start: async function () {
  },

  openView: async function () {

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

    await letter.connect(App.signer).openView();

    const openStatus = document.getElementById("openStatus");
    openStatus.innerHTML = "<b>Open Letter</b>";

    return;
  },

  closeView: async function () {

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

    await letter.connect(App.signer).closeView();

    const openStatus = document.getElementById("openStatus");
    openStatus.innerHTML = "<b>Closed Letter</b>";

    return;
  },

  addViewer: async function () {

    const contractAddr = document.getElementById("contractAddr").value;

    if (!ethers.utils.isAddress(contractAddr)) {
        window.alert("error: invalid Contract Address... Make sure there's no extra spaces on the input field");
        return;
    }

    const viewerAddr = document.getElementById("viewerAddr").value;

    if (!ethers.utils.isAddress(viewerAddr)) {
        window.alert("error: invalid Viewer Address... Make sure there's no extra spaces on the input field");
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

    await letter.connect(App.signer).addViewer(viewerAddr);

    const viewerStatus = document.getElementById("viewerStatus");
    viewerStatus.innerHTML = viewerAddr + "<b> is Viewer.</b>";

    return;
  },

  removeViewer: async function () {

    const contractAddr = document.getElementById("contractAddr").value;

    if (!ethers.utils.isAddress(contractAddr)) {
        window.alert("error: invalid Contract Address... Make sure there's no extra spaces on the input field");
        return;
    }

    const viewerAddr = document.getElementById("viewerAddr").value;

    if (!ethers.utils.isAddress(viewerAddr)) {
        window.alert("error: invalid Viewer Address... Make sure there's no extra spaces on the input field");
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

    await letter.connect(App.signer).removeViewer(viewerAddr);

    const viewerStatus = document.getElementById("viewerStatus");
    viewerStatus.innerHTML = viewerAddr + "<b> is not Viewer.</b>";

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