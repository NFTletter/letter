import Web3 from "web3";
import letterArtifact from "../../build/contracts/Letter.json";

const IPFS = require('ipfs-mini');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

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
  },

  displayPage: async function() {
    const { tokenURI } = this.meta.methods;
    const tokenId = document.getElementById("tokenId").value;

    if (isNaN(tokenId)) {
      window.alert("error: Page Token Id needs to be a number!");
      return;
    }

    try {
      const _tokenURI = await tokenURI(tokenId).call();
      const metadata = await ipfs.catJSON(_tokenURI);

      const title = metadata.title;
      const body = metadata.body;
      const author = metadata.author;
      const parent = metadata.parent;

      const display = document.getElementById("display");
      let pageHTML = "<br><br><table class=\"tg\" style=\"max-width:400px;\"><tbody>";
      if (title) {pageHTML += "<tr><td class=\"tg-left\">Title: </td><td class=\"tg-right\">" + title + "</td></tr>"};
      // ToDo: \n line break
      pageHTML += "<tr><td class=\"tg-left\">Body: </td><td class=\"tg-right\">" + body + "</td></tr>";
      if (author) {pageHTML += "<tr><td class=\"tg-left\">Author: </td><td class=\"tg-right\">" + author + "</td></tr>"};
      if (parent) {pageHTML += "<tr><td class=\"tg-left\">Parent Page Id: </td><td class=\"tg-right\">" + parent + "</td></tr>"};
      pageHTML += "<tr><td class=\"tg-left\">IPFS CID: </td><td class=\"tg-right\">" +  _tokenURI + "</td></tr>"
      pageHTML += "</tbody></table>"
      display.innerHTML = pageHTML;
    } catch(err) {
      window.alert("error: non-existent Page Token Id!");
      return;
    }
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
