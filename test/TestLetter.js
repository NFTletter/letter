const Letter = artifacts.require("Letter");
const keccak256 = require('keccak256');

var accounts;

var alice;
var bob;
var carol;

let VIEWER_ROLE = keccak256("VIEWER");

let title = "𝔥𝔢𝔩𝔩𝔬 𝔴𝔬𝔯𝔩𝔡";
let firstPage = "𝔯𝔬𝔰𝔢𝔰 𝔞𝔯𝔢 𝔯𝔢𝔡";
let secondPage = "𝔳𝔦𝔬𝔩𝔢𝔱𝔰 𝔞𝔯𝔢 𝔟𝔩𝔲𝔢";
let author = "𝓢𝓱𝓪𝓴𝓮𝓼𝓹𝓮𝓪𝓻𝓮";

contract('Letter', (accs) => {
    accounts = accs;

    alice = accounts[0];
    bob = accounts[1];
    carol = accounts[2];
});

it('fail to init Letter with empty first Page', async() => {
    let contract = await Letter.deployed();
    let err = null;

    try {
        await contract.initLetter(title, "", author);
    } catch (error) {
        err = error;
    }

    // failure to init Letter with empty first Page
    assert.ok(err instanceof Error);
});

it('init Letter with title + author', async() => {
    let contract = await Letter.deployed();

    // alice inits Letter
    await contract.initLetter(title, firstPage, author, {from: alice});
    let pageCount = await contract.viewPageCount();

    // assert Page
    assert.equal(pageCount.toNumber(), 1);
    assert.equal(await contract.viewPage(0), firstPage);

    // assert owner
    assert.equal(await contract.ownerOf(0), alice);

    // second Page
    await contract.mintAppendPage(secondPage, {from: alice});;
    pageCount = await contract.viewPageCount();

    // assert second Page
    assert.equal(pageCount.toNumber(), 2);
    assert.equal(await contract.viewPage(1), secondPage);
    
    // assert title + author
    assert.equal(await contract.viewTitle(), title);
    assert.equal(await contract.viewAuthor(), author);

    // Letter is initally closed
    assert.equal(await contract.isOpen(), false);
});

it('non-owner cannot append new pages', async() => {
    let page = "I cannot do this";

    let contract = await Letter.deployed();
    let err = null;

    try {
        await contract.mintAppendPage(page, {from: bob});
    } catch (error) {
        err = error;
    }

    // failure of bob trying to append a new page
    assert.ok(err instanceof Error);
});

it('non-owner cannot add viewer', async() => {
    let contract = await Letter.deployed();
    let err = null;

    // bob is not owner
    assert.notEqual(await contract.owner(), bob);

    try {
        await contract.addViewer(carol, {from: bob});
    } catch (error) {
        err = error;
    }

    // failure of bob trying to add carol as viewer
    assert.ok(err instanceof Error);
    assert.equal(await contract.hasRole(VIEWER_ROLE, carol), false);
});

it('non-owner cannot open view', async() => {
    let contract = await Letter.deployed();
    let err = null;

    // bob is not owner
    assert.notEqual(await contract.owner(), bob);

    try {
        await contract.openView({from: bob});
    } catch (error) {
        err = error;
    }

    // failure of bob trying to open view
    assert.ok(err instanceof Error);
    assert.equal(await contract.isOpen(), false);
});

it('owner can open view', async() => {
    let contract = await Letter.deployed();

    // alice is owner
    assert.equal(await contract.owner(), alice);

    await contract.openView({from: alice});

    // alice was able to open view
    assert.equal(await contract.isOpen(), true);
});

it('non-owner cannot close view', async() => {
    let contract = await Letter.deployed();
    let err = null;

    // bob is not owner
    assert.notEqual(await contract.owner(), bob);

    // view is open
    assert.equal(await contract.isOpen(), true);

    try {
        await contract.closeView({from: bob});
    } catch (error) {
        err = error;
    }

    // failure of bob trying to close view
    assert.ok(err instanceof Error);
    assert.equal(await contract.isOpen(), true);
});

it('owner can close view', async() => {
    let contract = await Letter.deployed();

    // alice is owner
    assert.equal(await contract.owner(), alice);

    await contract.closeView({from: alice});

    // alice was able to close view
    assert.equal(await contract.isOpen(), false);
});

it('non-viewer cannot view closed letter', async() => {
    let contract = await Letter.deployed();
    let err = null;

    // bob is not viewer
    assert.equal(await contract.hasRole(VIEWER_ROLE, bob), false);

    // letter is closed
    assert.equal(await contract.isOpen(), false);

    try {
        await contract.viewTitle({from: bob});
        await contract.viewPage(0, {from: bob});
        await contract.viewPage(1, {from: bob});
        await contract.viewAuthor({from: bob});
    } catch (error) {
        err = error;
    }

    // failure of bob trying view closed letter
    assert.ok(err instanceof Error);
});

it('non-viewer can view open letter', async() => {
    let contract = await Letter.deployed();

    // bob is not viewer
    assert.equal(await contract.hasRole(VIEWER_ROLE, bob), false);

    // letter is open
    await contract.openView();
    assert.equal(await contract.isOpen(), true);

    let viewedTitle = await contract.viewTitle({from: bob});
    let viewedFirstPage = await contract.viewPage(0, {from: bob});
    let viewedSecondPage = await contract.viewPage(1, {from: bob});
    let viewedAuthor = await contract.viewAuthor({from: bob});

    // letter viewed correctly
    assert.equal(viewedTitle, title);
    assert.equal(viewedFirstPage, firstPage);
    assert.equal(viewedSecondPage, secondPage);
    assert.equal(viewedAuthor, author);

});

it('owner can add viewer', async() => {
    let contract = await Letter.deployed();

    // alice is owner
    assert.equal(await contract.owner(), alice);

    // bob is not viewer
    assert.equal(await contract.hasRole(VIEWER_ROLE, bob), false);

    // alice adds bob as viewer
    await contract.addViewer(bob, {from: alice});

    // bob is viewer
    assert.equal(await contract.hasRole(VIEWER_ROLE, bob), true);
});

it('viewer can view closed letter', async() => {
    let contract = await Letter.deployed();

    // bob is viewer
    assert.equal(await contract.hasRole(VIEWER_ROLE, bob), true);

    // letter is closed
    await contract.closeView();
    assert.equal(await contract.isOpen(), false);

    let viewedTitle = await contract.viewTitle({from: bob});
    let viewedFirstPage = await contract.viewPage(0, {from: bob});
    let viewedSecondPage = await contract.viewPage(1, {from: bob});
    let viewedAuthor = await contract.viewAuthor({from: bob});

    // letter viewed correctly
    assert.equal(viewedTitle, title);
    assert.equal(viewedFirstPage, firstPage);
    assert.equal(viewedSecondPage, secondPage);
    assert.equal(viewedAuthor, author);
});

it('viewer can view open letter', async() => {
    let contract = await Letter.deployed();

    // bob is viewer
    assert.equal(await contract.hasRole(VIEWER_ROLE, bob), true);

    // letter is open
    await contract.openView();
    assert.equal(await contract.isOpen(), true);

    let viewedTitle = await contract.viewTitle({from: bob});
    let viewedFirstPage = await contract.viewPage(0, {from: bob});
    let viewedSecondPage = await contract.viewPage(1, {from: bob});
    let viewedAuthor = await contract.viewAuthor({from: bob});

    assert.equal(viewedTitle, title);
    assert.equal(viewedFirstPage, firstPage);
    assert.equal(viewedSecondPage, secondPage);
    assert.equal(viewedAuthor, author);
});

it('owner can remove viewer', async() => {
    let contract = await Letter.deployed();

    // alice is owner
    assert.equal(await contract.owner(), alice);

    // bob is viewer
    assert.equal(await contract.hasRole(VIEWER_ROLE, bob), true);

    // alice revokes bob as viewer
    await contract.removeViewer(bob, {from: alice});

    // bob is not viewer
    assert.equal(await contract.hasRole(VIEWER_ROLE, bob), false);
});
