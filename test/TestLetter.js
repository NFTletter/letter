const Letter = artifacts.require("Letter");

var accounts;

var alice;
var bob;
var carol;

contract('Letter', (accs) => {
    accounts = accs;

    alice = accounts[0];
    bob = accounts[1];
    carol = accounts[2];
});

it('fail to init Letter with empty first Page', async() => {
    let title = "𝔥𝔢𝔩𝔩𝔬 𝔴𝔬𝔯𝔩𝔡";
    let firstPage = "";
    let author = "𝓢𝓱𝓪𝓴𝓮𝓼𝓹𝓮𝓪𝓻𝓮";

    let contract = await Letter.deployed();
    let err = null;

    try {
        await contract.initLetter(title, "", author);
    } catch (error) {
        err = error;
    }

    // assert failure to init Letter with empty first Page
    assert.ok(err instanceof Error);
});

it('init Letter with title + author', async() => {
    let title = "𝔥𝔢𝔩𝔩𝔬 𝔴𝔬𝔯𝔩𝔡";
    let firstPage = "𝔯𝔬𝔰𝔢𝔰 𝔞𝔯𝔢 𝔯𝔢𝔡";
    let author = "𝓢𝓱𝓪𝓴𝓮𝓼𝓹𝓮𝓪𝓻𝓮";

    let contract = await Letter.deployed();

    // init Letter
    await contract.initLetter(title, firstPage, author);
    let pageCount = await contract.viewPageCount();

    // assert Page
    assert.equal(pageCount.toNumber(), 1);
    assert.equal(await contract.viewPage(0), firstPage);

    // second Page
    let secondPage = "𝔳𝔦𝔬𝔩𝔢𝔱𝔰 𝔞𝔯𝔢 𝔟𝔩𝔲𝔢";
    await contract.mintAppendPage(secondPage);
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

// ToDo: non-admin can't add admin

// ToDo: non-admin can't add viewer

// ToDo: non-admin can't open/close view

// ToDo: non-viewer can view open letter

// ToDo: non-viewer can't view closed letter

// ToDo: add admin

// ToDo: admin can add admin + viewer

// ToDo: admin can open/close view

// ToDo: viewer can view closed letter

// ToDo: viewer can view open letter
