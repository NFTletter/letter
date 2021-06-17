const LetterFactory = artifacts.require("LetterFactory");

var accounts;

var alice;
var bob;
var carol;

contract('LetterFactory', (accounts) => {
    alice = accounts[0];
    bob = accounts[1];
    carol = accounts[2];
});

it('create Letters from LetterFactory', async() => {
    const letterFactory = await LetterFactory.deployed();

    const txA = await letterFactory.createLetter("titleA", "initPageA", "authorA", {from: alice});
    const txB = await letterFactory.createLetter("titleB", "initPageB", "authorB", {from: bob});
    const txC = await letterFactory.createLetter("titleC", "initPageC", "authorC", {from: carol});

    // ...

});