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

While minting a new Page `tokenId`, to be appended to some Letter `xId`, the following operations happen, in this specific sequence:
  - `parentTokenId[tokenId] = tailId[xId]`
  - `tailId[xId] = tokenId`
  - `letterId[tokenId] = xId`

### Ownership

Each Letter Page Token is `Ownable`.

For some Page `_tokenId`, where `letterId[_tokenId] == xId`, only the owner of Letter `xId` can call `mintAppendPage(xId)`.

### Role-Based Access Control (RBAC)

#### Admin Role

The `Admin` role allows for some `account` to modify the Letter Access Controls.

For some Page `tokenId`, belonging to Letter `xId`, its `Admin` role is defined by `adminId = keccak256("ADMIN" + xId)`, which is a `byte32`. 

The `onlyAdmin` modifier restricts access for the execution of the following functions:
- `addAdmin(account, letterId)`
- `addViewer(account, letterId)`
- `revokeViewer(account, letterId)`
- `openViewer(letterId)`
- `closeViewer(letterId)`

The function `renounceAdmin(letterId)` removes `msg.sender` from the role defined by `adminId = keccak256("ADMIN" + letterId)`.


#### Viewer Role

The `Viewer` role allows for some `account` to visualize the Letter contents.

For some Page `tokenId`, belonging to Letter `xId`, its `Viewer` role is defined by `viewerId = keccak256("VIEWER" + xId)`, which is a `byte32`. 

For some Page `tokenId`, the `Viewer` role is "open" whenever `isViewer(0, tokenId) == true`. In other words, a Letter with an "open" `Viewer` role, means `isViewer(account, tokenId) == true` for any `account`. This behavior is set/unset by the functions `openViewer(letterId)` and `closeViewer(letterId)`.

The `onlyViewer` modifier restricts access for the execution of the following functions:
- `viewTitle(tokenId)`
- `viewBody(tokenId)`
- `viewRubric(tokenId)`


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