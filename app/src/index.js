const { ethers } = require("ethers");
import letterFactoryArtifact from "../../artifacts/contracts/LetterFactory.sol/LetterFactory.json";

const App = {
    provider: null,
    signer: null,

    start: async function () {

        try {
            LetterFactory = await ethers.getContractFactory("LetterFactory");
            letterFactory = await LetterFactory.deploy(); 
            await letterFactory.deployed();
        } catch (error) {
            console.error("Could not connect to contract or chain.");
        }
    },

    onClick: async function() {
        const test = document.getElementById("test");
        test.innerHTML = await this.signer.getAddress();
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