# 📜 NFT Letter ✍️

## Introduction

**Letter** is an [ERC-721 Smart Contract](http://erc721.org/) that allows for the creation of **text-based NFTs**, meant for **written artistic expression**.

**Letter** allows for art pieces such as **poems**, **novels**, **manifestos** and **source code** to be minted as Non-Fungible Tokens into the [Ethereum](https://ethereum.org/en/) blockchain. **All text is stored on-chain**.

## Smart Contract

`Letter.sol` is `ERC721Upgradeable`, while `LetterFactory.sol` specifies a *[Contract Cloning Factory](https://docs.openzeppelin.com/contracts/4.x/api/proxy#Clones)*.

Every time a new `Letter` is minted, a new *Contract Clone* is deployed, with logic residing the *Implementation Contract*, defined by `Letter.sol`.

A `Letter` has the following attributes:
- `string private _title`: max **64** characters, optionally empty.
- `string private _author`: max **64** characters, optionally empty.
- `string[] private _pages`, each array element represents a `Page`, with min 1, and max **65536** characters per `Page`.
- `bool private _open`: represents whether `Viewer` role is necessary to view `Letter` contents.

Each `Page` is a Non-Fungible Token (**NFT**) under the `Letter` *Contract Clone*.

### Gas

The number of characters on each `Letter`s title, author and `Page` contents determine Gas fees to be paid by the NFT minter.

Therefore, larger `Letter`s are more expensive to mint.

This economic dynamic discourages vandalism and meaningless NFTs.

### Ownership

Each `Letter` *Contract Clone* is `Ownable`.
Only the contract's `Owner` is able to mint new NFTs by appending new `Page`s to the `Letter`.

### Viewer Role (Access Control)

The `Viewer` role allows for some `account` to visualize the Letter Page Tokens.

The `onlyViewer` modifier restricts access for the execution of the following functions:
- `viewTitle()`
- `viewBody(pageN)`
- `viewAuthor()`

The `_open` attribute of the `Letter` *Contract Clone* overwrites the behavior of this role.
If `isOpen() == true`, then `onlyViewer` has no effect, and every `account` is able to view `Letter` contents.

The `onlyOwner` modifier restricts access for the execution of the following functions:
- `addViewer(account)`
- `removeViewer(account)`
- `openView()`
- `closeView()`

## Roadmap

- [x] `Letter.sol`.
- [x] Tests for `Letter.sol`.
- [ ] `LetterFactory.sol`.
- [ ] Tests for `LetterFactory.sol`.
- [ ] Minter Front End.
- [ ] Display Front End.
- [ ] Testnet deployment + Feedback.
- [ ] Automated Auditing.
- [ ] Natspec documentation.
- [ ] [Prepare for Mainnet](https://docs.openzeppelin.com/learn/preparing-for-mainnet).
- [ ] Mainnet deployment.