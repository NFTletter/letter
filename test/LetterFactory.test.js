const { expect } = require("chai");
const { ethers } = require("hardhat");
const keccak256 = require('keccak256');
const letterABI = require("../data/abi/LetterABI.json");

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

        expect(await letterFactory.viewLetterCount()).to.equal(3);

        const { events: events0 } = await tx0.wait();
        const { address: address0 } = events0.find(Boolean);
        const { events: eventsA } = await txA.wait();
        const { address: addressA } = eventsA.find(Boolean);
        const { events: eventsB } = await txB.wait();
        const { address: addressB } = eventsB.find(Boolean);

        expect(await letterFactory.viewLetterAddr(0)).to.equal(address0);
        expect(await letterFactory.viewLetterAddr(1)).to.equal(addressA);
        expect(await letterFactory.viewLetterAddr(2)).to.equal(addressB);

        let letter0 = new ethers.Contract(address0, letterABI, provider);
        let letterA = new ethers.Contract(addressA, letterABI, provider);
        let letterB = new ethers.Contract(addressB, letterABI, provider);

        // check Letter Contract owners
        expect(await letter0.connect(owner).owner()).to.equal(owner.address);
        expect(await letterA.connect(owner).owner()).to.equal(alice.address);
        expect(await letterB.connect(owner).owner()).to.equal(bob.address);

        // check Letter Titles
        expect(await letter0.connect(owner).readTitle()).to.equal("title0");
        expect(await letterA.connect(alice).readTitle()).to.equal("titleA");
        expect(await letterB.connect(bob).readTitle()).to.equal("titleB");

        // check Letter Init Pages
        expect(await letter0.connect(owner).readPage(0)).to.equal("initPage0");
        expect(await letterA.connect(alice).readPage(0)).to.equal("initPageA");
        expect(await letterB.connect(bob).readPage(0)).to.equal("initPageB");

        // check Letter Authors
        expect(await letter0.connect(owner).readAuthor()).to.equal("owner");
        expect(await letterA.connect(alice).readAuthor()).to.equal("alice");
        expect(await letterB.connect(bob).readAuthor()).to.equal("bob");

        // append new Pages
        await letter0.connect(owner).writePage("secondPage0");
        await letterA.connect(alice).writePage("secondPageA");
        await letterB.connect(bob).writePage("secondPageB");

        // check appended Pages
        expect(await letter0.connect(owner).readPage(1)).to.equal("secondPage0");
        expect(await letterA.connect(alice).readPage(1)).to.equal("secondPageA");
        expect(await letterB.connect(bob).readPage(1)).to.equal("secondPageB");
    });
});

describe("LetterFactory Clone Page appending tests", function () {
    let title = "𝔥𝔢𝔩𝔩𝔬 𝔴𝔬𝔯𝔩𝔡";
    let firstPage = "𝔯𝔬𝔰𝔢𝔰 𝔞𝔯𝔢 𝔯𝔢𝔡";
    let secondPage = "𝔳𝔦𝔬𝔩𝔢𝔱𝔰 𝔞𝔯𝔢 𝔟𝔩𝔲𝔢";
    let author = "𝓢𝓱𝓪𝓴𝓮𝓼𝓹𝓮𝓪𝓻𝓮";

    let LetterFactory;
    let letterFactory;
    let provider;
    let letter;

    beforeEach(async function () {
        [owner, alice] = await ethers.getSigners();

        provider = ethers.getDefaultProvider();

        LetterFactory = await ethers.getContractFactory("LetterFactory");
        letterFactory = await LetterFactory.deploy();

        const tx = await letterFactory.createLetter(title, firstPage, author);
        const { events } = await tx.wait();
        const { address: letterAddress } = events.find(Boolean);

        letter = new ethers.Contract(letterAddress, letterABI, provider);
    });

    afterEach(async function () {
        letterFactory = null;
        letter = null;
    });

    it('owner can append new pages', async() => {
        let page = "I can do this";
    
        await letter.connect(owner).writePage(page);
    
        expect(await letter.connect(owner).viewPageCount()).to.equal(2);
    });

    it('non-owner cannot append new pages', async() => {
        let page = "I cannot do this";
    
        try {
            await letter.connect(alice).writePage(page);
        } catch (error) {
            err = error;
        }
    
        // failure of alice trying to append a new page
        expect(err).to.be.an.instanceOf(Error);
    });

});

describe("LetterFactory Clone View tests", function () {
    let VIEWER_ROLE = keccak256("VIEWER");

    let title = "𝔥𝔢𝔩𝔩𝔬 𝔴𝔬𝔯𝔩𝔡";
    let firstPage = "𝔯𝔬𝔰𝔢𝔰 𝔞𝔯𝔢 𝔯𝔢𝔡";
    let secondPage = "𝔳𝔦𝔬𝔩𝔢𝔱𝔰 𝔞𝔯𝔢 𝔟𝔩𝔲𝔢";
    let author = "𝓢𝓱𝓪𝓴𝓮𝓼𝓹𝓮𝓪𝓻𝓮";

    let LetterFactory;
    let letterFactory;
    let provider;
    let letter;

    beforeEach(async function () {
        [owner, alice] = await ethers.getSigners();

        provider = ethers.getDefaultProvider();

        LetterFactory = await ethers.getContractFactory("LetterFactory");
        letterFactory = await LetterFactory.deploy();

        const tx = await letterFactory.createLetter(title, firstPage, author);
        const { events } = await tx.wait();
        const { address: letterAddress } = events.find(Boolean);

        letter = new ethers.Contract(letterAddress, letterABI, provider);
    });

    afterEach(async function () {
        letterFactory = null;
    });

    it('non-owner cannot add reader', async() => {
    
        // alice is not owner
        expect(await letter.connect(owner).owner()).to.not.equal(alice.address);
    
        try {
            await letter.addReader(bob.address, {from: alice.address});
        } catch (error) {
            err = error;
        }
    
        // failure of alice trying to add bob as reader
        expect(err).to.be.an.instanceOf(Error);
        expect(await letter.connect(owner).isReader(bob.address)).to.equal(false);
    });

    it('owner can add reader', async() => {
    
        // alice is not reader
        expect(await letter.connect(owner).isReader(alice.address)).to.equal(false);
    
        // owner adds alice as reader
        await letter.connect(owner).addReader(alice.address);
    
        // alice is reader
        expect(await letter.connect(owner).isReader(alice.address)).to.equal(true);
    });

    it('non-owner cannot open read', async() => {
    
        // alice is not owner
        expect(await letter.connect(owner).owner()).to.not.equal(alice.address);

        try {
            await letter.connect(alice).open();
        } catch (error) {
            err = error;
        }
    
        // failure of alice trying to open read
        expect(err).to.be.an.instanceOf(Error);
        expect(await letter.connect(owner).isOpen()).to.equal(false);
    });

    it('owner can open read', async() => {
    
        // owner is owner
        expect(await letter.connect(owner).owner()).to.equal(owner.address);
    
        await letter.connect(owner).open({from: owner.address});
    
        // owner was able to open read
        expect(await letter.connect(owner).isOpen()).to.equal(true);
    });

    it('non-owner cannot close read', async() => {

        // alice is not owner
        expect(await letter.connect(owner).owner()).to.not.equal(alice.address);
    
        // read is open
        await letter.connect(owner).open({from: owner.address});
        expect(await letter.connect(owner).isOpen()).to.equal(true);
    
        try {
            await letter.connect(alice).close();
        } catch (error) {
            err = error;
        }
    
        // failure of alice trying to close read
        expect(err).to.be.an.instanceOf(Error);
        expect(await letter.connect(owner).isOpen()).to.equal(true);
    });

    it('owner can close read', async() => {
    
        // owner is owner
        expect(await letter.connect(owner).owner()).to.equal(owner.address);

        // read is closed
        expect(await letter.connect(owner).isOpen()).to.equal(false);
    
        await letter.connect(owner).close();
    
        // owner was able to close read
        expect(await letter.connect(owner).isOpen()).to.equal(false);
    });

    it('non-reader cannot read closed letter', async() => {

        // alice is not reader
        expect(await letter.connect(owner).isReader(alice.address)).to.equal(false);
        
        // read is closed
        expect(await letter.connect(owner).isOpen()).to.equal(false);
    
        try {
            await letter.connect(alice).readTitle();
            await letter.connect(alice).readPage(0);
            await letter.connect(alice).readPage(1);
            await letter.connect(alice).readAuthor();
        } catch (error) {
            err = error;
        }
    
        // failure of alice trying read closed letter
        expect(err).to.be.an.instanceOf(Error);
    });

    it('non-reader can read open letter', async() => {
    
        // alice is not reader
        expect(await letter.connect(owner).isReader(alice.address)).to.equal(false);
    
        // read is open
        await letter.connect(owner).open();
        expect(await letter.connect(owner).isOpen()).to.equal(true);
    
        let readedTitle = await letter.connect(alice).readTitle();
        let readedFirstPage = await letter.connect(alice).readPage(0);
        let readedAuthor = await letter.connect(alice).readAuthor();
    
        // letter readed correctly
        expect(readedTitle).to.equal(title);
        expect(readedFirstPage).to.equal(firstPage);
        expect(readedAuthor).to.equal(author);    
    });

    it('reader can read closed letter', async() => {
    
        // alice is not reader
        expect(await letter.connect(owner).isReader(alice.address)).to.equal(false);
    
        // owner adds alice as reader
        await letter.connect(owner).addReader(alice.address);
    
        // read is closed
        expect(await letter.connect(owner).isOpen()).to.equal(false);
    
        let readTitle = await letter.connect(alice).readTitle();
        let readFirstPage = await letter.connect(alice).readPage(0);
        let readAuthor = await letter.connect(alice).readAuthor();
    
        // letter readed correctly
        expect(readTitle).to.equal(title);
        expect(readFirstPage).to.equal(firstPage);
        expect(readAuthor).to.equal(author);
    });

    it('reader can read open letter', async() => {

        // owner adds alice as reader
        await letter.connect(owner).addReader(alice.address);

        // alice is reader
        expect(await letter.connect(owner).isReader(alice.address)).to.equal(true);
    
        // read is open
        await letter.connect(owner).open();
        expect(await letter.connect(owner).isOpen()).to.equal(true);
    
        let readTitle = await letter.connect(alice).readTitle();
        let readFirstPage = await letter.connect(alice).readPage(0);
        let readAuthor = await letter.connect(alice).readAuthor();
    
        // letter readed correctly
        expect(readTitle).to.equal(title);
        expect(readFirstPage).to.equal(firstPage);
        expect(readAuthor).to.equal(author);
    });

    it('owner can remove reader', async() => {

        // owner adds alice as reader
        await letter.connect(owner).addReader(alice.address);

        // alice is reader
        expect(await letter.connect(owner).isReader(alice.address)).to.equal(true);
    
        // owner revokes alice as reader
        await letter.connect(owner).removeReader(alice.address);
    
        // alice is not reader
        expect(await letter.connect(owner).isReader(alice.address)).to.equal(false);
    });

    it('new page owner is reader, prev page owner remains reader (transferFrom)', async() => {
    
        // owner is page owner
        expect(await letter.connect(owner).ownerOf(0)).to.equal(owner.address);
    
        // alice is not reader
        expect(await letter.connect(owner).isReader(alice.address)).to.equal(false);
    
        // transfer first page from owner to alice
        await letter.connect(owner).transferFrom(owner.address, alice.address, 0);
    
        // alice is page owner
        expect(await letter.connect(owner).ownerOf(0)).to.equal(alice.address);
    
        // alice is reader
        expect(await letter.connect(owner).isReader(alice.address)).to.equal(true);
    
        // owner is still 
        expect(await letter.connect(owner).isReader(owner.address)).to.equal(true);
    
    });

    it('new page owner is reader, prev page owner remains reader (safeTransferFrom)', async() => {
    
        // owner is page owner
        expect(await letter.connect(owner).ownerOf(0)).to.equal(owner.address);
    
        // alice is not reader
        expect(await letter.connect(owner).isReader(alice.address)).to.equal(false);
    
        // safeTransfer first page from owner to alice
        await letter.connect(owner)['safeTransferFrom(address,address,uint256,bytes)'](owner.address, alice.address, 0, 0);
    
        // alice is page owner
        expect(await letter.connect(owner).ownerOf(0)).to.equal(alice.address);
    
        // alice is reader
        expect(await letter.connect(owner).isReader(alice.address)).to.equal(true);
    
        // owner is still reader
        expect(await letter.connect(owner).isReader(alice.address)).to.equal(true);
    
    });

});