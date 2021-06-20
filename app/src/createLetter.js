import Web3 from "web3";
import letterFactoryArtifact from "../../artifacts/contracts/LetterFactory.sol/LetterFactory.json";

const App = {

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = letterFactoryArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        letterFactoryArtifact.abi,
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

  createLetter: async function() {
    const { createLetter } = this.meta.methods;

    // max 64 chars
    const title = document.getElementById("title").value;
    console.log(title.length);
    if (title.length > 64) {
      window.alert("error: Tile must have maximum 64 characters.");
      return;
    }

    // not empty, max 8192 chars
    const body = document.getElementById("body").value;
    if (body.length > 8192) {
      window.alert("error: Body must have maximum 8192 characters.");
      return;
    }

    // max 64 chars
    const author = document.getElementById("author").value;
    if (author.length > 64) {
      window.alert("error: Author must have maximum 64 characters.");
      return;
    }

    // ToDo: check safety
    await createLetter(title, page, author).call({from: this.account});
    createLetter(title, page, author).call({from: this.account})

    const status = "Letter Created";

    App.setStatus(status + note)
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
