const { expect } = require("chai");
const { ethers } = require("hardhat");
const keccak256 = require('keccak256');
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
        await letter0.connect(owner).mintPage("secondPage0");
        await letterA.connect(alice).mintPage("secondPageA");
        await letterB.connect(bob).mintPage("secondPageB");

        // check appended Pages
        expect(await letter0.connect(owner).viewPage(1)).to.equal("secondPage0");
        expect(await letterA.connect(alice).viewPage(1)).to.equal("secondPageA");
        expect(await letterB.connect(bob).viewPage(1)).to.equal("secondPageB");
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
    
        await letter.connect(owner).mintPage(page);
    
        expect(await letter.connect(owner).viewPageCount()).to.equal(2);
    });

    it('non-owner cannot append new pages', async() => {
        let page = "I cannot do this";
    
        try {
            await letter.connect(alice).mintPage(page);
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

    it('non-owner cannot add viewer', async() => {
    
        // alice is not owner
        expect(await letter.connect(owner).owner()).to.not.equal(alice.address);
    
        try {
            await letter.addViewer(bob.address, {from: alice.address});
        } catch (error) {
            err = error;
        }
    
        // failure of alice trying to add bob as viewer
        expect(err).to.be.an.instanceOf(Error);
        expect(await letter.connect(owner).hasRole(VIEWER_ROLE, bob.address)).to.equal(false);
    });

    it('owner can add viewer', async() => {
    
        // alice is not viewer
        expect(await letter.connect(owner).hasRole(VIEWER_ROLE, alice.address)).to.equal(false);
    
        // owner adds alice as viewer
        await letter.connect(owner).addViewer(alice.address);
    
        // alice is viewer
        expect(await letter.connect(owner).hasRole(VIEWER_ROLE, alice.address)).to.equal(true);
    });

    it('non-owner cannot open view', async() => {
    
        // alice is not owner
        expect(await letter.connect(owner).owner()).to.not.equal(alice.address);

        try {
            await letter.connect(alice).openView();
        } catch (error) {
            err = error;
        }
    
        // failure of alice trying to open view
        expect(err).to.be.an.instanceOf(Error);
        expect(await letter.connect(owner).isOpen()).to.equal(false);
    });

    it('owner can open view', async() => {
    
        // owner is owner
        expect(await letter.connect(owner).owner()).to.equal(owner.address);
    
        await letter.connect(owner).openView({from: owner.address});
    
        // owner was able to open view
        expect(await letter.connect(owner).isOpen()).to.equal(true);
    });

    it('non-owner cannot close view', async() => {

        // alice is not owner
        expect(await letter.connect(owner).owner()).to.not.equal(alice.address);
    
        // view is open
        await letter.connect(owner).openView({from: owner.address});
        expect(await letter.connect(owner).isOpen()).to.equal(true);
    
        try {
            await letter.connect(alice).closeView();
        } catch (error) {
            err = error;
        }
    
        // failure of alice trying to close view
        expect(err).to.be.an.instanceOf(Error);
        expect(await letter.connect(owner).isOpen()).to.equal(true);
    });

    it('owner can close view', async() => {
    
        // owner is owner
        expect(await letter.connect(owner).owner()).to.equal(owner.address);

        // view is closed
        expect(await letter.connect(owner).isOpen()).to.equal(false);
    
        await letter.connect(owner).closeView();
    
        // owner was able to close view
        expect(await letter.connect(owner).isOpen()).to.equal(false);
    });

    it('non-viewer cannot view closed letter', async() => {

        // alice is not viewer
        expect(await letter.connect(owner).hasRole(VIEWER_ROLE, alice.address)).to.equal(false);
        
        // view is closed
        expect(await letter.connect(owner).isOpen()).to.equal(false);
    
        try {
            await letter.connect(alice).viewTitle();
            await letter.connect(alice).viewPage(0);
            await letter.connect(alice).viewPage(1);
            await letter.connect(alice).viewAuthor();
        } catch (error) {
            err = error;
        }
    
        // failure of alice trying view closed letter
        expect(err).to.be.an.instanceOf(Error);
    });

    it('non-viewer can view open letter', async() => {
    
        // alice is not viewer
        expect(await letter.connect(owner).hasRole(VIEWER_ROLE, alice.address)).to.equal(false);
    
        // view is open
        await letter.connect(owner).openView();
        expect(await letter.connect(owner).isOpen()).to.equal(true);
    
        let viewedTitle = await letter.connect(alice).viewTitle();
        let viewedFirstPage = await letter.connect(alice).viewPage(0);
        let viewedAuthor = await letter.connect(alice).viewAuthor();
    
        // letter viewed correctly
        expect(viewedTitle).to.equal(title);
        expect(viewedFirstPage).to.equal(firstPage);
        expect(viewedAuthor).to.equal(author);    
    });

    it('viewer can view closed letter', async() => {
    
        // alice is not viewer
        expect(await letter.connect(owner).hasRole(VIEWER_ROLE, alice.address)).to.equal(false);
    
        // owner adds alice as viewer
        await letter.connect(owner).addViewer(alice.address);
    
        // view is closed
        expect(await letter.connect(owner).isOpen()).to.equal(false);
    
        let viewedTitle = await letter.connect(alice).viewTitle();
        let viewedFirstPage = await letter.connect(alice).viewPage(0);
        let viewedAuthor = await letter.connect(alice).viewAuthor();
    
        // letter viewed correctly
        expect(viewedTitle).to.equal(title);
        expect(viewedFirstPage).to.equal(firstPage);
        expect(viewedAuthor).to.equal(author);
    });

    it('viewer can view open letter', async() => {

        // owner adds alice as viewer
        await letter.connect(owner).addViewer(alice.address);

        // alice is viewer
        expect(await letter.connect(owner).hasRole(VIEWER_ROLE, alice.address)).to.equal(true);
    
        // view is open
        await letter.connect(owner).openView();
        expect(await letter.connect(owner).isOpen()).to.equal(true);
    
        let viewedTitle = await letter.connect(alice).viewTitle();
        let viewedFirstPage = await letter.connect(alice).viewPage(0);
        let viewedAuthor = await letter.connect(alice).viewAuthor();
    
        // letter viewed correctly
        expect(viewedTitle).to.equal(title);
        expect(viewedFirstPage).to.equal(firstPage);
        expect(viewedAuthor).to.equal(author);
    });

    it('owner can remove viewer', async() => {

        // owner adds alice as viewer
        await letter.connect(owner).addViewer(alice.address);

        // alice is viewer
        expect(await letter.connect(owner).hasRole(VIEWER_ROLE, alice.address)).to.equal(true);
    
        // owner revokes alice as viewer
        await letter.connect(owner).removeViewer(alice.address);
    
        // alice is not viewer
        expect(await letter.connect(owner).hasRole(VIEWER_ROLE, alice.address)).to.equal(false);
    });

    it('new page owner is viewer, prev page owner remains viewer (transferFrom)', async() => {
    
        // owner is page owner
        expect(await letter.connect(owner).ownerOf(0)).to.equal(owner.address);
    
        // alice is not viewer
        expect(await letter.connect(owner).hasRole(VIEWER_ROLE, alice.address)).to.equal(false);
    
        // transfer first page from owner to alice
        await letter.connect(owner).transferFrom(owner.address, alice.address, 0);
    
        // alice is page owner
        expect(await letter.connect(owner).ownerOf(0)).to.equal(alice.address);
    
        // alice is viewer
        expect(await letter.connect(owner).hasRole(VIEWER_ROLE, alice.address)).to.equal(true);
    
        // owner is still viewer
        expect(await letter.connect(owner).hasRole(VIEWER_ROLE, owner.address)).to.equal(true);
    
    });

    it('new page owner is viewer, prev page owner remains viewer (safeTransferFrom)', async() => {
    
        // owner is page owner
        expect(await letter.connect(owner).ownerOf(0)).to.equal(owner.address);
    
        // alice is not viewer
        expect(await letter.connect(owner).hasRole(VIEWER_ROLE, alice.address)).to.equal(false);
    
        // safeTransfer first page from owner to alice
        await letter.connect(owner)['safeTransferFrom(address,address,uint256,bytes)'](owner.address, alice.address, 0, 0);
    
        // alice is page owner
        expect(await letter.connect(owner).ownerOf(0)).to.equal(alice.address);
    
        // alice is viewer
        expect(await letter.connect(owner).hasRole(VIEWER_ROLE, alice.address)).to.equal(true);
    
        // owner is still viewer
        expect(await letter.connect(owner).hasRole(VIEWER_ROLE, owner.address)).to.equal(true);
    
    });

});