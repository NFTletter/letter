const { expect } = require("chai");
const { ethers } = require("hardhat");
const keccak256 = require('keccak256');

let title = "𝔥𝔢𝔩𝔩𝔬 𝔴𝔬𝔯𝔩𝔡";
let firstPage = "𝔯𝔬𝔰𝔢𝔰 𝔞𝔯𝔢 𝔯𝔢𝔡";
let secondPage = "𝔳𝔦𝔬𝔩𝔢𝔱𝔰 𝔞𝔯𝔢 𝔟𝔩𝔲𝔢";
let author = "𝓢𝓱𝓪𝓴𝓮𝓼𝓹𝓮𝓪𝓻𝓮";

let Contract;
let contract;
let err;

describe("Letter Contract Initialization tests", function () {
    beforeEach(async function () {
        [owner] = await ethers.getSigners()

        Contract = await ethers.getContractFactory("Letter");
        contract = await Contract.deploy();
    });

    afterEach(async function () {
        contract = null;
    });

    it('fail to init Letter with empty first Page', async() => {
        try {
            await contract.initLetter(title, "", author, owner.address);
        } catch (error) {
            err = error;
        }
    
        // failure to init Letter with empty first Page
        expect(err).to.be.an.instanceOf(Error);
    });
    
    it('init Letter with title + author', async() => {
    
        // owner inits Letter
        await contract.initLetter(title, firstPage, author, owner.address);
        let pageCount = await contract.viewPageCount();
    
        // expect first Page
        expect(pageCount.toNumber()).to.equal(1);
        expect(await contract.viewPage(0)).to.equal(firstPage);
    
        // expect owner
        expect(await contract.ownerOf(0)).to.equal(owner.address);
    
        // mint second Page
        await contract.mintAppendPage(secondPage);;
        pageCount = await contract.viewPageCount();
    
        // expect second Page
        expect(pageCount.toNumber()).to.equal(2);
        expect(await contract.viewPage(1)).to.equal(secondPage);
        
        // expect title + author
        expect(await contract.viewTitle()).to.equal(title);
        expect(await contract.viewAuthor()).to.equal(author);
    
        // expect is initally closed
        expect(await contract.isOpen()).to.equal(false);
    });

});

describe("Letter Contract View tests", function () {
    let VIEWER_ROLE = keccak256("VIEWER");

    beforeEach(async function () {
        [owner, alice, bob] = await ethers.getSigners()

        Contract = await ethers.getContractFactory("Letter");
        contract = await Contract.deploy();

        // owner inits Letter
        await contract.initLetter(title, firstPage, author, owner.address);

        // mint second Page
        await contract.mintAppendPage(secondPage);
    });

    afterEach(async function () {
        contract = null;
    });

    it('non-owner cannot append new pages', async() => {
        let page = "I cannot do this";
    
        try {
            await contract.mintAppendPage(page, {from: alice.address});
        } catch (error) {
            err = error;
        }
    
        // failure of alice trying to append a new page
        expect(err).to.be.an.instanceOf(Error);
    });
    
    it('non-owner cannot add viewer', async() => {
    
        // alice is not owner
        expect(await contract.owner()).to.not.equal(alice.address);
    
        try {
            await contract.addViewer(bob.address, {from: alice.address});
        } catch (error) {
            err = error;
        }
    
        // failure of bob trying to add carol as viewer
        expect(err).to.be.an.instanceOf(Error);
        expect(await contract.hasRole(VIEWER_ROLE, bob.address)).to.equal(false);
    });
    
    it('non-owner cannot open view', async() => {
    
        // alice is not owner
        expect(await contract.owner()).to.not.equal(alice.address);
    
        try {
            await contract.openView({from: alice.address});
        } catch (error) {
            err = error;
        }
    
        // failure of bob trying to open view
        expect(err).to.be.an.instanceOf(Error);
        expect(await contract.isOpen()).to.equal(false);
    });
    
    it('owner can open view', async() => {
    
        // owner is owner
        expect(await contract.owner()).to.equal(owner.address);
    
        await contract.openView({from: owner.address});
    
        // owner was able to open view
        expect(await contract.isOpen()).to.equal(true);
    });
    
    it('non-owner cannot close view', async() => {

        // alice is not owner
        expect(await contract.owner()).to.not.equal(alice.address);
    
        // view is open
        await contract.openView({from: owner.address});
        expect(await contract.isOpen()).to.equal(true);
    
        try {
            await contract.closeView({from: bob});
        } catch (error) {
            err = error;
        }
    
        // failure of alice trying to close view
        expect(err).to.be.an.instanceOf(Error);
        expect(await contract.isOpen()).to.equal(true);
    });
    
    it('owner can close view', async() => {
    
        // owner is owner
        expect(await contract.owner()).to.equal(owner.address);

        // view is closed
        expect(await contract.isOpen()).to.equal(false);
    
        await contract.closeView({from: owner.address});
    
        // alice was able to close view
        expect(await contract.isOpen()).to.equal(false);
    });
    
    it('non-viewer cannot view closed letter', async() => {

        // alice is not viewer
        expect(await contract.hasRole(VIEWER_ROLE, alice.address)).to.equal(false);
        
        // view is closed
        expect(await contract.isOpen()).to.equal(false);
    
        try {
            await contract.viewTitle({from: alice.address});
            await contract.viewPage(0, {from: alice.address});
            await contract.viewPage(1, {from: alice.address});
            await contract.viewAuthor({from: alice.address});
        } catch (error) {
            err = error;
        }
    
        // failure of alices trying view closed letter
        expect(err).to.be.an.instanceOf(Error);
    });
    
    it('non-viewer can view open letter', async() => {
    
        // alice is not viewer
        expect(await contract.hasRole(VIEWER_ROLE, alice.address)).to.equal(false);
    
        // view is open
        await contract.openView();
        expect(await contract.isOpen()).to.equal(true);
    
        let viewedTitle = await contract.connect(alice.address).viewTitle();
        let viewedFirstPage = await contract.connect(alice.address).viewPage(0);
        let viewedSecondPage = await contract.connect(alice.address).viewPage(1);
        let viewedAuthor = await contract.connect(alice.address).viewAuthor();
    
        // letter viewed correctly
        expect(viewedTitle).to.equal(title);
        expect(viewedFirstPage).to.equal(firstPage);
        expect(viewedSecondPage).to.equal(secondPage);
        expect(viewedAuthor).to.equal(author);    
    });
    
    it('owner can add viewer', async() => {
    
        // alice is not viewer
        expect(await contract.hasRole(VIEWER_ROLE, alice.address)).to.equal(false);
    
        // owner adds alice as viewer
        await contract.addViewer(alice.address);
    
        // alice is viewer
        expect(await contract.hasRole(VIEWER_ROLE, alice.address)).to.equal(true);
    });
    
    it('viewer can view closed letter', async() => {
    
        // alice is not viewer
        expect(await contract.hasRole(VIEWER_ROLE, alice.address)).to.equal(false);
    
        // owner adds alice as viewer
        await contract.addViewer(alice.address);
    
        // view is closed
        expect(await contract.isOpen()).to.equal(false);
    
        let viewedTitle = await contract.connect(alice.address).viewTitle();
        let viewedFirstPage = await contract.connect(alice.address).viewPage(0);
        let viewedSecondPage = await contract.connect(alice.address).viewPage(1);
        let viewedAuthor = await contract.connect(alice.address).viewAuthor();
    
        // letter viewed correctly
        expect(viewedTitle).to.equal(title);
        expect(viewedFirstPage).to.equal(firstPage);
        expect(viewedSecondPage).to.equal(secondPage);
        expect(viewedAuthor).to.equal(author);
    });
    
    it('viewer can view open letter', async() => {

        // owner adds alice as viewer
        await contract.addViewer(alice.address);

        // alice is viewer
        expect(await contract.hasRole(VIEWER_ROLE, alice.address)).to.equal(true);
    
        // view is open
        await contract.openView();
        expect(await contract.isOpen()).to.equal(true);
    
        let viewedTitle = await contract.connect(alice.address).viewTitle();
        let viewedFirstPage = await contract.connect(alice.address).viewPage(0);
        let viewedSecondPage = await contract.connect(alice.address).viewPage(1);
        let viewedAuthor = await contract.connect(alice.address).viewAuthor();
    
        // letter viewed correctly
        expect(viewedTitle).to.equal(title);
        expect(viewedFirstPage).to.equal(firstPage);
        expect(viewedSecondPage).to.equal(secondPage);
        expect(viewedAuthor).to.equal(author);
    });
    
    it('owner can remove viewer', async() => {

        // owner adds alice as viewer
        await contract.addViewer(alice.address);

        // alice is viewer
        expect(await contract.hasRole(VIEWER_ROLE, alice.address)).to.equal(true);
    
        // owner revokes alice as viewer
        await contract.removeViewer(alice.address);
    
        // alice is not viewer
        expect(await contract.hasRole(VIEWER_ROLE, alice.address)).to.equal(false);
    });
    
    it('new page owner is viewer, prev page owner remains viewer (transferFrom)', async() => {
    
        // owner is page owner
        expect(await contract.ownerOf(0)).to.equal(owner.address);
    
        // alice is not viewer
        expect(await contract.hasRole(VIEWER_ROLE, alice.address)).to.equal(false);
    
        // transfer first page from owner to alice
        await contract.transferFrom(owner.address, alice.address, 0);
    
        // alice is page owner
        expect(await contract.ownerOf(0)).to.equal(alice.address);
    
        // alice is viewer
        expect(await contract.hasRole(VIEWER_ROLE, alice.address)).to.equal(true);
    
        // owner is still viewer
        expect(await contract.hasRole(VIEWER_ROLE, owner.address)).to.equal(true);
    
    });
    
    it('new page owner is viewer, prev page owner remains viewer (safeTransferFrom)', async() => {
    
        // owner is page owner
        expect(await contract.ownerOf(0)).to.equal(owner.address);
    
        // alice is not viewer
        expect(await contract.hasRole(VIEWER_ROLE, alice.address)).to.equal(false);
    
        // safeTransfer first page from owner to alice
        await contract['safeTransferFrom(address,address,uint256,bytes)'](owner.address, alice.address, 0, 0);
    
        // alice is page owner
        expect(await contract.ownerOf(0)).to.equal(alice.address);
    
        // alice is viewer
        expect(await contract.hasRole(VIEWER_ROLE, alice.address)).to.equal(true);
    
        // owner is still viewer
        expect(await contract.hasRole(VIEWER_ROLE, owner.address)).to.equal(true);
    
    });
    
});