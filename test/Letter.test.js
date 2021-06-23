const { expect } = require("chai");
const { ethers } = require("hardhat");

const MAX_TITLE_LEN = 64;
const MAX_PAGE_LEN = 8192;
const MAX_AUTHOR_LEN = 64;

let title = "𝔥𝔢𝔩𝔩𝔬 𝔴𝔬𝔯𝔩𝔡";
let firstPage = "𝔯𝔬𝔰𝔢𝔰 𝔞𝔯𝔢 𝔯𝔢𝔡";
let secondPage = "𝔳𝔦𝔬𝔩𝔢𝔱𝔰 𝔞𝔯𝔢 𝔟𝔩𝔲𝔢";
let author = "𝓢𝓱𝓪𝓴𝓮𝓼𝓹𝓮𝓪𝓻𝓮";

let Contract;
let contract;
let err;

function genString(n) {
    return new Array(n + 1).join('0');
}

describe("Letter Contract Initialization tests", function () {
    beforeEach(async function () {
        [owner] = await ethers.getSigners()

        Contract = await ethers.getContractFactory("Letter");
        contract = await Contract.deploy();
    });

    afterEach(async function () {
        contract = null;
        err = null;
    });

    it('init empty Letter', async() => {
        // owner inits Letter
        await contract.initLetter("", "", "", owner.address);
        let pageCount = await contract.viewPageCount();
    
        // expect first Page
        expect(pageCount.toNumber()).to.equal(1);
        expect(await contract.readPage(0)).to.equal("");
        
        // expect title + author
        expect(await contract.readTitle()).to.equal("");
        expect(await contract.readAuthor()).to.equal("");
    
        // expect is initally closed
        expect(await contract.isOpen()).to.equal(false);
    });

    it('init Letter exceed Title chars', async() => {
        try {
            await contract.initLetter(genString(MAX_TITLE_LEN + 1), "", "", owner.address);
        } catch (error) {
            err = error;
        }
    
        // failure of alice trying to append a new page
        expect(err).to.be.an.instanceOf(Error);
    });

    it('init Letter exceed Page chars', async() => {
        try {
            await contract.initLetter("", genString(MAX_PAGE_LEN + 1), "", owner.address);
        } catch (error) {
            err = error;
        }
    
        // failure of alice trying to append a new page
        expect(err).to.be.an.instanceOf(Error);
    });

    it('init Letter exceed Author chars', async() => {
        try {
            await contract.initLetter("", "", genString(MAX_AUTHOR_LEN + 1), owner.address);
        } catch (error) {
            err = error;
        }
    
        // failure of alice trying to append a new page
        expect(err).to.be.an.instanceOf(Error);
    });
    
    it('init Letter', async() => {
    
        // owner inits Letter
        await contract.initLetter(title, firstPage, author, owner.address);
        let pageCount = await contract.viewPageCount();
    
        // expect first Page
        expect(pageCount.toNumber()).to.equal(1);
        expect(await contract.readPage(0)).to.equal(firstPage);
    
        // expect owner
        expect(await contract.ownerOf(0)).to.equal(owner.address);
    
        // mint second Page
        await contract.writePage(secondPage);;
        pageCount = await contract.viewPageCount();
    
        // expect second Page
        expect(pageCount.toNumber()).to.equal(2);
        expect(await contract.readPage(1)).to.equal(secondPage);
        
        // expect title + author
        expect(await contract.readTitle()).to.equal(title);
        expect(await contract.readAuthor()).to.equal(author);
    
        // expect is initally closed
        expect(await contract.isOpen()).to.equal(false);
    });

});

describe("Letter Contract Page appending tests", function () {
    beforeEach(async function () {
        [owner, alice, bob] = await ethers.getSigners()

        Contract = await ethers.getContractFactory("Letter");
        contract = await Contract.deploy();

        // owner inits Letter
        await contract.initLetter(title, firstPage, author, owner.address);

    });

    afterEach(async function () {
        contract = null;
        err = null;
    });

    it('exceed appended page chars', async() => {
        try {
            await contract.writePage(genString(MAX_PAGE_LEN + 1), {from: owner.address});
        } catch (error) {
            err = error;
        }
    
        // failure of alice trying to append a new page
        expect(err).to.be.an.instanceOf(Error);
    });

    it('owner can append new pages', async() => {
        let page = "I can do this";
    
        await contract.writePage(page, {from: owner.address});
    
        expect(await contract.viewPageCount()).to.equal(2);
    });

    it('non-owner cannot append new pages', async() => {
        let page = "I cannot do this";
    
        try {
            await contract.writePage(page, {from: alice.address});
        } catch (error) {
            err = error;
        }
    
        // failure of alice trying to append a new page
        expect(err).to.be.an.instanceOf(Error);
    });

});

describe("Letter Contract View tests", function () {

    beforeEach(async function () {
        [owner, alice, bob] = await ethers.getSigners()

        Contract = await ethers.getContractFactory("Letter");
        contract = await Contract.deploy();

        // owner inits Letter
        await contract.initLetter(title, firstPage, author, owner.address);

        // mint second Page
        await contract.writePage(secondPage);
    });

    afterEach(async function () {
        contract = null;
    });
    
    it('non-owner cannot add reader', async() => {
    
        // alice is not owner
        expect(await contract.owner()).to.not.equal(alice.address);
    
        try {
            await contract.addReader(bob.address, {from: alice.address});
        } catch (error) {
            err = error;
        }
    
        // failure of alice trying to add bob as reader
        expect(err).to.be.an.instanceOf(Error);
        expect(await contract.isReader(bob.address)).to.equal(false);
    });
    
    it('owner can add reader', async() => {
    
        // alice is not reader
        expect(await contract.isReader(alice.address)).to.equal(false);
    
        // owner adds alice as reader
        await contract.addReader(alice.address);
    
        // alice is reader
        expect(await contract.isReader(alice.address)).to.equal(true);
    });

    it('non-owner cannot open', async() => {
    
        // alice is not owner
        expect(await contract.owner()).to.not.equal(alice.address);
    
        try {
            await contract.open({from: alice.address});
        } catch (error) {
            err = error;
        }
    
        // failure of alice trying to open
        expect(err).to.be.an.instanceOf(Error);
        expect(await contract.isOpen()).to.equal(false);
    });
    
    it('owner can open', async() => {
    
        // owner is owner
        expect(await contract.owner()).to.equal(owner.address);
    
        await contract.open({from: owner.address});
    
        // owner was able to open
        expect(await contract.isOpen()).to.equal(true);
    });
    
    it('non-owner cannot close', async() => {

        // alice is not owner
        expect(await contract.owner()).to.not.equal(alice.address);
    
        // view is open
        await contract.open({from: owner.address});
        expect(await contract.isOpen()).to.equal(true);
    
        try {
            await contract.close({from: alice});
        } catch (error) {
            err = error;
        }
    
        // failure of alice trying to close
        expect(err).to.be.an.instanceOf(Error);
        expect(await contract.isOpen()).to.equal(true);
    });
    
    it('owner can close', async() => {
    
        // owner is owner
        expect(await contract.owner()).to.equal(owner.address);

        // read is closed
        expect(await contract.isOpen()).to.equal(false);
    
        await contract.close({from: owner.address});
    
        // owner was able to close
        expect(await contract.isOpen()).to.equal(false);
    });
    
    it('non-reader cannot read closed letter', async() => {

        // alice is not reader
        expect(await contract.isReader(alice.address)).to.equal(false);
        
        // read is closed
        expect(await contract.isOpen()).to.equal(false);
    
        try {
            await contract.readTitle({from: alice.address});
            await contract.readPage(0, {from: alice.address});
            await contract.readPage(1, {from: alice.address});
            await contract.readAuthor({from: alice.address});
        } catch (error) {
            err = error;
        }
    
        // failure of alice trying read closed letter
        expect(err).to.be.an.instanceOf(Error);
    });
    
    it('non-reader can read open letter', async() => {
    
        // alice is not reader
        expect(await contract.isReader(alice.address)).to.equal(false);
    
        // read is open
        await contract.open();
        expect(await contract.isOpen()).to.equal(true);
    
        let readTitle = await contract.connect(alice.address).readTitle();
        let readFirstPage = await contract.connect(alice.address).readPage(0);
        let readSecondPage = await contract.connect(alice.address).readPage(1);
        let readAuthor = await contract.connect(alice.address).readAuthor();
    
        // letter read correctly
        expect(readTitle).to.equal(title);
        expect(readFirstPage).to.equal(firstPage);
        expect(readSecondPage).to.equal(secondPage);
        expect(readAuthor).to.equal(author);    
    });
    
    it('reader can read closed letter', async() => {
    
        // alice is not reader
        expect(await contract.isReader(alice.address)).to.equal(false);
    
        // owner adds alice as reader
        await contract.addReader(alice.address);
    
        // read is closed
        expect(await contract.isOpen()).to.equal(false);
    
        let readTitle = await contract.connect(alice.address).readTitle();
        let readFirstPage = await contract.connect(alice.address).readPage(0);
        let readSecondPage = await contract.connect(alice.address).readPage(1);
        let readAuthor = await contract.connect(alice.address).readAuthor();
    
        // letter read correctly
        expect(readTitle).to.equal(title);
        expect(readFirstPage).to.equal(firstPage);
        expect(readSecondPage).to.equal(secondPage);
        expect(readAuthor).to.equal(author);
    });
    
    it('reader can read open letter', async() => {

        // owner adds alice as reader
        await contract.addReader(alice.address);

        // alice is reader
        expect(await contract.isReader(alice.address)).to.equal(true);
    
        // read is open
        await contract.open();
        expect(await contract.isOpen()).to.equal(true);
    
        let readTitle = await contract.connect(alice.address).readTitle();
        let readFirstPage = await contract.connect(alice.address).readPage(0);
        let readSecondPage = await contract.connect(alice.address).readPage(1);
        let readAuthor = await contract.connect(alice.address).readAuthor();
    
        // letter readed correctly
        expect(readTitle).to.equal(title);
        expect(readFirstPage).to.equal(firstPage);
        expect(readSecondPage).to.equal(secondPage);
        expect(readAuthor).to.equal(author);
    });
    
    it('owner can remove reader', async() => {

        // owner adds alice as reader
        await contract.addReader(alice.address);

        // alice is reader
        expect(await contract.isReader(alice.address)).to.equal(true);
    
        // owner revokes alice as reader
        await contract.removeReader(alice.address);
    
        // alice is not reader
        expect(await contract.isReader(alice.address)).to.equal(false);
    });
    
    it('new page owner is reader, prev page owner remains reader (transferFrom)', async() => {
    
        // owner is page owner
        expect(await contract.ownerOf(0)).to.equal(owner.address);
    
        // alice is not reader
        expect(await contract.isReader(alice.address)).to.equal(false);
    
        // transfer first page from owner to alice
        await contract.transferFrom(owner.address, alice.address, 0);
    
        // alice is page owner
        expect(await contract.ownerOf(0)).to.equal(alice.address);
    
        // alice is reader
        expect(await contract.isReader(alice.address)).to.equal(true);
    
        // owner is still reader
        expect(await contract.isReader(alice.address)).to.equal(true);
    
    });
    
    it('new page owner is reader, prev page owner remains reader (safeTransferFrom)', async() => {
    
        // owner is page owner
        expect(await contract.ownerOf(0)).to.equal(owner.address);
    
        // alice is not reader
        expect(await contract.isReader(alice.address)).to.equal(false);
    
        // safeTransfer first page from owner to alice
        await contract['safeTransferFrom(address,address,uint256,bytes)'](owner.address, alice.address, 0, 0);
    
        // alice is page owner
        expect(await contract.ownerOf(0)).to.equal(alice.address);
    
        // alice is reader
        expect(await contract.isReader(alice.address)).to.equal(true);
    
        // owner is still reader
        expect(await contract.isReader(owner.address)).to.equal(true);
    
    });
    
});