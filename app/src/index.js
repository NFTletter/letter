import Web3 from "web3";
import letterArtifact from "../../build/contracts/Letter.json";

const pinataSDK = require('@pinata/sdk');
const pinataConfig = require('../pinataConfig.json');
const pinataAPIKey = pinataConfig.APIKey;
const pinataSecretKey = pinataConfig.SecretKey;
const pinata = pinataSDK(pinataAPIKey, pinataSecretKey);

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

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },

  createPage: async function() {
    const { createPage } = this.meta.methods;
    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;
    const author = document.getElementById("author").value;
    const parent = document.getElementById("parent").value;

    // ToDo: check parent tokenId is number
    // ToDo: check parent tokenId exists
    // ToDo: check body is not empty

    const pageJSON = {
      "title": title,
      "body": body,
      "author": author,
      "parent": parent,
    }

    const options = {
      pinataMetadata: {
        name: "LetterPage",
      },
      pinataOptions: {
        cidVersion: 0
      }
    };
    var result = await pinata.pinJSONToIPFS(pageJSON, options).catch((err) => {
      console.log(err);
    });

    const ipfsCID = result.IpfsHash;
    console.log(result);

    // ToDo: fix newTokenId
    const newTokenId = await createPage(ipfsCID).send({from: this.account});
    console.log(newTokenId);
    const status = "Page Token Id: " + newTokenId + "<br> IPFS CID: " + ipfsCID;

    App.setStatus(status)
  }

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
