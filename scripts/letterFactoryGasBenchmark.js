const { ethers } = require("ethers");
const hre = require("hardhat");
const letterABI = require("../app/data/abi/LetterABI.json");

let LetterFactory;
let letterFactory;

let provider;

let titleLength;
let title;
let pageLength;
let page;

let tx;
let letterClone;

let letter;
let owner;

let cost;

function genString(n) {
    return new Array(n + 1).join('0');
}

async function benchmarkWriteLetter() {
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("benchmark createLetter() with fixed Title + Author");
    console.log("...................................................");
    console.log("1st Page Len.\tGas Used\tETH Cost @ 6.1 Gwei");
    console.log("---------------------------------------------------");

    // iterate between 1 and 8192 characters
    for (let j = 0; j < 14; j++) {

        let pageLength = Math.pow(2, j);
        let page = genString(pageLength);

        // create Letter Contract Clone
        tx = await letterFactory.createLetter("𝔥𝔢𝔩𝔩𝔬 𝔴𝔬𝔯𝔩𝔡", page, "𝓢𝓱𝓪𝓴𝓮𝓼𝓹𝓮𝓪𝓻𝓮");
        let { gasUsed } = await tx.wait();

        cost = 6.1 * gasUsed * 0.000000001;

        console.log(pageLength + "\t\t" + gasUsed + "\t\t" + cost);
    }
}

async function benchmarkWriteLetterMax() {
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("benchmark createLetter() with maximum Title + Page + Author lenghts");
    console.log("....................................................................................");
    console.log("1st Page Len.\tTitle Lenght\tAuthor Length\tGas Used\tETH Cost @ 6.1 Gwei");
    console.log("------------------------------------------------------------------------------------");

    // create Letter Contract Clone
    tx = await letterFactory.createLetter(genString(64), genString(8192), genString(64));
    let { gasUsed } = await tx.wait();

    cost = 6.1 * gasUsed * 0.000000001;

    console.log("8192\t\t64\t\t64\t\t" + gasUsed + "\t\t" + cost);
}

async function benchmarkWritePage() {
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("benchmark writePage()");
    console.log("...................................................");
    console.log("Page Length\tGas Used\tETH Cost @ 6.1 Gwei");
    console.log("---------------------------------------------------");

    // create Letter Contract Clone
    tx = await letterFactory.createLetter("𝔥𝔢𝔩𝔩𝔬 𝔴𝔬𝔯𝔩𝔡", "𝔯𝔬𝔰𝔢𝔰 𝔞𝔯𝔢 𝔯𝔢𝔡", "𝓢𝓱𝓪𝓴𝓮𝓼𝓹𝓮𝓪𝓻𝓮");
    //let { gasUsed } = await tx.wait();

    let { events } = await tx.wait();
    let { address: letterAddress } = events.find(Boolean);

    letter = new ethers.Contract(letterAddress, letterABI, provider);

    // iterate between 1 and 8192 characters
    for (let j = 0; j < 14; j++) {

        let pageLength = Math.pow(2, j);
        let page = genString(pageLength);

        tx = await letter.connect(owner).writePage(page);
        let { gasUsed } = await tx.wait();

        cost = 6.1 * gasUsed * 0.000000001;

        console.log(pageLength + "\t\t" + gasUsed + "\t\t" + cost);
    }
}

async function main() {
    [owner] = await hre.ethers.getSigners();
    LetterFactory = await hre.ethers.getContractFactory("LetterFactory");
    letterFactory = await LetterFactory.deploy();
    await letterFactory.deployed();
    provider = ethers.getDefaultProvider();

    await benchmarkWriteLetter();
    await benchmarkWriteLetterMax();
    await benchmarkWritePage();
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
