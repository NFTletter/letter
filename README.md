# 📜 Letter ✍️

## Introduction

**Letter** is an [ERC-721 Smart Contract](http://erc721.org/) that allows for the creation of **text-based NFTs**, meant for **written artistic expression**.

**Letter** allows for art pieces such as **poems**, **novels**, **manifestos** and **source code** to be minted as Non-Fungible Tokens into the [Ethereum](https://ethereum.org/en/) blockchain. All text is stored on-chain.

## Smart Contract

`Letter.sol` is `ERC721Upgradeable`, while `LetterFactory.sol` specifies a *[Contract Factory](https://docs.openzeppelin.com/contracts/4.x/api/proxy)*.

Every time a new `Letter` is minted, a new *Proxy Contract* is deployed, with logic residing the *Implementation Contract*, defined by `Letter.sol`. Within a `Letter` *Proxy Contract*, each NFT represents a single `Page`.

A `Letter` has the following attributes:
- `string private _title`: max 64 characters, optionally empty.
- `string private _author`: max 64 characters, optionally empty.
- `bool private _open`: represents whether `Viewer` role is necessary to view `Letter` contents.
- `string[] private _pages`, each element represents a `Page`, min 1, max 65536 characters per `Page`.

Each `Page` is a Token under the `Letter` *Proxy Contract*.

### Ownership

Each Letter Contract is `Ownable`. Only `Owner` is able to append new Page Tokens to some Letter Contract.

### Role-Based Access Control (RBAC)

#### Admin Role

The `Admin` role allows for some `account` to modify the Access Controls of the Letter contract.

The `onlyAdmin` modifier restricts access for the execution of the following functions:
- `addAdmin(account)`
- `addViewer(account)`
- `revokeViewer(account)`
- `openView()`
- `closeView()`

The function `renounceAdmin()` removes `msg.sender` from the role.

#### Viewer Role

The `Viewer` role allows for some `account` to visualize the Letter Page Tokens.

The `onlyViewer` modifier restricts access for the execution of the following functions:
- `viewTitle()`
- `viewBody(pageN)`
- `viewAuthor()`


The `_open` attribute of the `Letter` *Proxy Contract* overwrites the behavior of this role. If `isOpen() == true`, then `isViewer(account) == true` for any `account`.

## Roadmap

- [x] `Letter.json`.
- [ ] Brownie tests for `Letter.json`.
- [ ] `LetterFactory.json`.
- [ ] Brownie tests for `LetterFactory.json`.
- [ ] Minter Front End.
- [ ] Display Front End.
- [ ] Testnet deployment + Feedback.
- [ ] Automated Auditing.
- [ ] Natspec documentation.
- [ ] [Prepare for Mainnet](https://docs.openzeppelin.com/learn/preparing-for-mainnet).
- [ ] Mainnet deployment.