const { expect } = require("chai");
const { ethers } = require("hardhat");
const letterABI = require("./LetterABI.json");

describe("LetterFactory Clone Creation tests", function () {

    let LetterFactory;
    let letterFactory;
    let provider;

    beforeEach(async function () {
        [owner, alice, bob] = await ethers.getSigners();

        provider = ethers.getDefaultProvider();

        LetterFactory = await ethers.getContractFactory("LetterFactory");
        letterFactory = await LetterFactory.deploy();
    });

    afterEach(async function () {
        letterFactory = null;
    });

    it('create Letters from LetterFactory', async() => {
        const tx0 = await letterFactory.createLetter("title0", "initPage0", "owner");
        const txA = await letterFactory.connect(alice).createLetter("titleA", "initPageA", "alice");
        const txB = await letterFactory.connect(bob).createLetter("titleB", "initPageB", "bob");

        const { events: events0 } = await tx0.wait();
        const { address: address0 } = events0.find(Boolean);
        const { events: eventsA } = await txA.wait();
        const { address: addressA } = eventsA.find(Boolean);
        const { events: eventsB } = await txB.wait();
        const { address: addressB } = eventsB.find(Boolean);

        let letter0 = new ethers.Contract(address0, letterABI, provider);
        let letterA = new ethers.Contract(addressA, letterABI, provider);
        let letterB = new ethers.Contract(addressB, letterABI, provider);

        // check Letter Contract owners
        expect(await letter0.connect(owner).owner()).to.equal(owner.address);
        expect(await letterA.connect(owner).owner()).to.equal(alice.address);
        expect(await letterB.connect(owner).owner()).to.equal(bob.address);

        // check Letter Titles
        expect(await letter0.connect(owner).viewTitle()).to.equal("title0");
        expect(await letterA.connect(alice).viewTitle()).to.equal("titleA");
        expect(await letterB.connect(bob).viewTitle()).to.equal("titleB");

        // check Letter Init Pages
        expect(await letter0.connect(owner).viewPage(0)).to.equal("initPage0");
        expect(await letterA.connect(alice).viewPage(0)).to.equal("initPageA");
        expect(await letterB.connect(bob).viewPage(0)).to.equal("initPageB");

        // check Letter Authors
        expect(await letter0.connect(owner).viewAuthor()).to.equal("owner");
        expect(await letterA.connect(alice).viewAuthor()).to.equal("alice");
        expect(await letterB.connect(bob).viewAuthor()).to.equal("bob");

        // append new Pages
        await letter0.connect(owner).mintAppendPage("secondPage0");
        await letterA.connect(alice).mintAppendPage("secondPageA");
        await letterB.connect(bob).mintAppendPage("secondPageB");

        // check appended Pages
        expect(await letter0.connect(owner).viewPage(1)).to.equal("secondPage0");
        expect(await letterA.connect(alice).viewPage(1)).to.equal("secondPageA");
        expect(await letterB.connect(bob).viewPage(1)).to.equal("secondPageB");
    });
});

describe("LetterFactory Clone View tests", function () {
    let title = "𝔥𝔢𝔩𝔩𝔬 𝔴𝔬𝔯𝔩𝔡";
    let firstPage = "𝔯𝔬𝔰𝔢𝔰 𝔞𝔯𝔢 𝔯𝔢𝔡";
    let secondPage = "𝔳𝔦𝔬𝔩𝔢𝔱𝔰 𝔞𝔯𝔢 𝔟𝔩𝔲𝔢";
    let author = "𝓢𝓱𝓪𝓴𝓮𝓼𝓹𝓮𝓪𝓻𝓮";

    let LetterFactory;
    let letterFactory;
    let provider;

    beforeEach(async function () {
        [owner, alice] = await ethers.getSigners();

        provider = ethers.getDefaultProvider();

        LetterFactory = await ethers.getContractFactory("LetterFactory");
        letterFactory = await LetterFactory.deploy();

        const tx = await letterFactory.createLetter(title, firstPage, author);
        const { events } = await tx0.wait();
        const { address: letterAddress } = events.find(Boolean);

        let letter = new ethers.Contract(letterAddress, letterABI, provider);
    });

    afterEach(async function () {
        letterFactory = null;
    });

    // ToDo: view tests

});