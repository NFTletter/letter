const { ethers } = require("ethers");
import letterABI from "../data/abi/LetterABI.json";

let letter;

const App = {
    provider: null,
    signer: null,

    start: async function () {
    },

    readPage: async function () {

        const address = document.getElementById("contractAddr").value.toString();

        if (!ethers.utils.isAddress(address)) {
            window.alert("error: invalid Address... Make sure there's no extra spaces on the input field");
            return;
        }

        try {
            letter = new ethers.Contract(address, letterABI, this.provider);
        } catch (err) {
            window.alert("error: invalid Letter Contract Address");
            return;
        }

        let signerAddr = await App.signer.getAddress();
        if (!(await letter.connect(App.signer).isReader(signerAddr))) {
            window.alert("error: you must have the Reader role for this Letter");
            return;
        }

        let title;
        let page;
        let author;
        let owner;

        const pageTokenId = document.getElementById("pageTokenId").value;

        if (pageTokenId >= await letter.connect(App.signer).viewPageCount()) {
            window.alert("error: invalid Page Token Id");
            return;
        }

        const read = document.getElementById("read");
        read.innerHTML = "<br><br>Reading Page... please wait."

        try {
            title = await letter.connect(App.signer).readTitle();
            page = await letter.connect(App.signer).readPage(pageTokenId);
            author = await letter.connect(App.signer).readAuthor();
            owner = await letter.connect(App.signer).owner();
        } catch (err) {
            window.alert("error: unable to View");
            return;
        }

        
        let pageHTML = "<br><br><table class=\"tg\" style=\"max-width:400px;font-size: 20px\"><tbody>";
        if (title) { pageHTML += "<tr><td class=\"tg-left\">Title: </td><td class=\"tg-right\">" + title + "</td></tr>" };
        // ToDo: \n line break
        if (page) { pageHTML += "<tr><td class=\"tg-left\">Page: </td><td class=\"tg-right\">" + page + "</td></tr>" };
        if (author) { pageHTML += "<tr><td class=\"tg-left\">Author: </td><td class=\"tg-right\">" + author + "</td></tr>" };
        pageHTML += "<tr><td class=\"tg-left\">Owner: </td><td class=\"tg-right\">" + owner + "</td></tr>"
        pageHTML += "</tbody></table>"
        read.innerHTML = pageHTML;
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