# 📜 Letter ✍️

## Introduction

**Letter** is an [ERC-721 Smart Contract](http://erc721.org/) that allows for the creation of **text-based NFTs**, meant for **written artistic expression**.

**Letter** allows for art pieces such as **poems**, **novels**, **manifestos** and **source code** to be minted as Non-Fungible Tokens into the [Ethereum](https://ethereum.org/en/) blockchain. All text is stored on-chain.

## Smart Contract

`Letter.sol` is `ERC721Upgradeable`, while `LetterFactory.sol` specifies a *[Contract Factory](https://docs.openzeppelin.com/contracts/4.x/api/proxy)*.

Every time a new `Letter` is minted, a new *Proxy Contract* is deployed, with logic residing the *Implementation Contract*, defined by `Letter.sol`.

A `Letter` has the following attributes:
- `string private _title`: max 64 characters, optionally empty.
- `string private _author`: max 64 characters, optionally empty.
- `string[] private _pages`, each element represents a `Page`, min 1, max 65536 characters per `Page`.
- `bool private _open`: represents whether `Viewer` role is necessary to view `Letter` contents.

Each `Page` is a Non-Fungible Token (**NFT**) under the `Letter` *Proxy Contract*.

### Ownership

Each `Letter` *Proxy Contract* is `Ownable`. Only the `Owner` is able to append new Pages a `Letter` by minting new NFTs.

### Role-Based Access Control (RBAC)

#### Viewer Role

The `Viewer` role allows for some `account` to visualize the Letter Page Tokens.

The `onlyViewer` modifier restricts access for the execution of the following functions:
- `viewTitle()`
- `viewBody(pageN)`
- `viewAuthor()`

The `_open` attribute of the `Letter` *Proxy Contract* overwrites the behavior of this role. If `isOpen() == true`, then `isViewer(account) == true` for any `account`.

The `onlyOwner` modifier restricts access for the execution of the following functions:
- `addViewer(account)`
- `revokeViewer(account)`
- `openView()`
- `closeView()`

## Roadmap

- [x] `Letter.json`.
- [x] Tests for `Letter.json`.
- [ ] `LetterFactory.json`.
- [ ] Tests for `LetterFactory.json`.
- [ ] Minter Front End.
- [ ] Display Front End.
- [ ] Testnet deployment + Feedback.
- [ ] Automated Auditing.
- [ ] Natspec documentation.
- [ ] [Prepare for Mainnet](https://docs.openzeppelin.com/learn/preparing-for-mainnet).
- [ ] Mainnet deployment.