# 📜 Letter ✍️

## Introduction

**Letter** is an [ERC-721 Smart Contract](http://erc721.org/) that allows for the creation of **text-based NFTs**, meant for **written artistic expression**.

**Letter** allows for art pieces such as **poems**, **novels**, **manifestos** and **source code** to be minted as Non-Fungible Tokens into the [Ethereum](https://ethereum.org/en/) blockchain. All text is stored on-chain.

## Smart Contract Logic

### Page

Each NFT consist of a Page, represented by the following struct:
```
struct Page {
  string title;
  string body;
  string rubric;
}
```

Where each field has the following properties:
- `title`: optional, max 64 characters.
- `body`: mandatory, max 65536 characters.
- `rubric`: optional, max 64 characters.

A Page is identified by a `tokenId`.

The `storage` mapping `page[tokenId]` creates the correspondance between each `tokenId` and its `struct Page`.

### Letter

A Letter is defined as a Linked List of Pages. Each Letter is identified by it's head Page's `tokenId`.

A new Letter is created via the `mintLetter()` function.
A new Page is appended to an existing Letter via the `mintAppendPage()` function.

The `tailId[letterId]` mapping keeps track of the Letter's tail `tokenId`.

The `parentTokenId[tokenId]` mapping assigns a Parent Page Id to some Page.

The `letterId[tokenId]` mapping assigns which Letter each Page belongs to.

If a Page `tokenId` is some Letter's head (`letterId[tokenId] == tokenId`), then it has no Parent Page Id (`parentTokenId[tokenId] == 0`).

In order to append a Page `newTokenId` to a Letter `xId`, such that `letterId[newTokenId] = xId`, `msg.sender` must own `xId`. In other words, only the owner of a Letter can append Pages to it.

While minting a new Page `tokenId`, to be appended to some Letter `xId`, the following operations happen, in this specific sequence:
  - `parentTokenId[tokenId] = tailId[xId]`
  - `tailId[xId] = tokenId`
  - `letterId[tokenId] = xId`

## Roadmap

- [x] Solidity Source Code (OpenZeppelin ERC-721).
- [ ] Ownable, Access Control.
- [ ] Brownie tests.
- [ ] Minter Front End.
- [ ] Display Front End.
- [ ] Testnet deployment + Feedback.
- [ ] Automated Auditing.
- [ ] Natspec documentation.
- [ ] [Prepare for Mainnet](https://docs.openzeppelin.com/learn/preparing-for-mainnet).
- [ ] Mainnet deployment.