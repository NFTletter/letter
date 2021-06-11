import Web3 from "web3";
import letterArtifact from "../../build/contracts/Letter.json";

const IPFS = require('ipfs-core');
const toBuffer = require('it-to-buffer')
var ipfs;

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = letterArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        letterArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }

    // init ipfs
    ipfs = await IPFS.create();
  },

  displayPage: async function() {
    const { tokenURI } = this.meta.methods;
    const tokenId = document.getElementById("tokenId").value;

    const _tokenURI = await tokenURI(tokenId).call();
    console.log(_tokenURI);

    const metadataBuf = await toBuffer(ipfs.cat(_tokenURI));
    const metadata = metadataBuf.toString();

    console.log(metadata);

    // const title = metadata.title;
    // const body = metadata.body;
    // const author = metadata.author;
    // const parent = metadata.parent;
    //const display = document.getElementById("display");
    //const pageHTML = "Title: " + title + "<br> Body: " + body + "<br> Author: " + author + "<br> Parent Page Id: " + parent;
    //display.innerHTML = pageHTML;

    //ipfs.destroy()
  },

};

window.App = App;

window.addEventListener("load", async function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    await window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",);
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"),);
  }

  App.start();
});
