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

    const openStatus = document.getElementById("openStatus");

    if (await letter.connect(App.signer).isOpen()) {
      openStatus.innerHTML = "<b>Letter is already Open.</b>";
      return;
    }
    openStatus.innerHTML = "Opening Letter... please wait for Transaction to be mined.";

    const tx = await letter.connect(App.signer).open();
    await tx.wait();

    openStatus.innerHTML = "<b>Letter is Open.</b>";

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

    const openStatus = document.getElementById("openStatus");

    if (!(await letter.connect(App.signer).isOpen())) {
      openStatus.innerHTML = "<b>Letter is already Closed.</b>";
      return;
    }
    openStatus.innerHTML = "Closing Letter... please wait for Transaction to be mined.";

    const tx = await letter.connect(App.signer).close();
    await tx.wait();
    
    openStatus.innerHTML = "<b>Closed Letter.</b>";

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

    const readerStatus = document.getElementById("readerStatus");
    
    if (await letter.connect(App.signer).isReader(readerAddr)){
      readerStatus.innerHTML = "<b>" + readerAddr + " is already Reader.</b>";
      return;
    }

    readerStatus.innerHTML = "Adding Reader... please wait for Transaction to be mined.";

    const tx = await letter.connect(App.signer).addReader(readerAddr);
    await tx.wait();

    readerStatus.innerHTML = "<b>" + readerAddr + " is Reader.</b>";

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

    const readerStatus = document.getElementById("readerStatus");
    
    if (!(await letter.connect(App.signer).isReader(readerAddr))){
      readerStatus.innerHTML = "<b>" + readerAddr + " is already not Reader.</b>";
      return;
    }

    readerStatus.innerHTML = "Removing Reader... please wait for Transaction to be mined.";

    const tx = await letter.connect(App.signer).removeReader(readerAddr);
    await tx.wait();

    readerStatus.innerHTML = "<b>" + readerAddr + "is not Reader.</b>";

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