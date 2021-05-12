# Letter ✍️

## Introduction

**Letter** is an [ERC-721 Smart Contract](https://eips.ethereum.org/EIPS/eip-721) that allows for the creation of **text-based NFTs**, meant for **written artistic expression**.


**Letter** allows for art pieces such as **poems**, **novels**, **manifestos** and **source code** to be minted as Non-Fungible Tokens into the [Ethereum](https://ethereum.org/en/) blockchain.


Each Non-Fungible Token represents a **Page** with the following fields:

<table class="tg">
<thead>
  <tr>
    <th class="tg-head">Field<br></th>
    <th class="tg-head">Description</th>
    <th class="tg-head">Encoding</th>
    <th class="tg-head">Optional?</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-body">Id</td>
    <td class="tg-body">Page Id</td>
    <td class="tg-body">HEX</td>
    <td class="tg-body">no</td>
  </tr>
  <tr>
    <td class="tg-body">Nonce</td>
    <td class="tg-body">Page counter</td>
    <td class="tg-body">HEX</td>
    <td class="tg-body">no</td>
  </tr>
  <tr>
    <td class="tg-body">Title</td>
    <td class="tg-body">Title of the Page</td>
    <td class="tg-body">Unicode</td>
    <td class="tg-body">yes</td>
  </tr>
  <tr>
    <td class="tg-body">Body</td>
    <td class="tg-body">Actual contents of the Page</td>
    <td class="tg-body">Unicode</td>
    <td class="tg-body">no</td>
  </tr>
  <tr>
    <td class="tg-body">Rubric</td>
    <td class="tg-body">Author signature</td>
    <td class="tg-body">Unicode</td>
    <td class="tg-body">yes</td>
  </tr>
  <tr>
    <td class="tg-body">Parent</td>
    <td class="tg-body">Id of parent Page</td>
    <td class="tg-body">HEX</td>
    <td class="tg-body">yes</td>
  </tr>
</tbody>
</table>

[Unicode](https://home.unicode.org/) allows for the widest possible range of digital text-based expression.

## Instructions

1. Open a Truffle console with a local development private network:
```
$ npx truffle develop
...
```

2. Deploy Letter to the local privatenet:
```
truffle(develop)> migrate
...
```

3. Load Letter:
```
truffle(develop)> nft = await ERC721PresetMinterPauserAutoId.deployed()
undefined
```

4. Interact with Letter:
```
truffle(develop)> await nft.name()
'letter'
truffle(develop)> await nft.symbol()
'LETT'
```

5. Mint Pages:
```
truffle(develop)> await nft.mint("0xaddr...")
```

## Roadmap

- [ ] Solidity source.
- [ ] IPFS storage.
- [ ] Testnet deployment.
- [ ] Mint Testnet Hello World Token.
- [ ] OpenSea Hello World Token validation.
- [ ] [Prepare for Mainnet](https://docs.openzeppelin.com/learn/preparing-for-mainnet).
- [ ] Mainnet deployment.

## References
 - [po.et](https://poetproject.medium.com/)
 - [OpenZeppelin Forum Post: Create an NFT and deploy to a public testnet, using Truffle](https://forum.openzeppelin.com/t/create-an-nft-and-deploy-to-a-public-testnet-using-truffle/2961)
 - [OpenSea ERC-721 Tutorial](https://docs.opensea.io/docs/1-structuring-your-smart-contract)
 - [OpenZeppelin ERC-721PresetMinterPauserAutoId ERC721 Preset](https://docs.openzeppelin.com/contracts/3.x/api/presets#ERC721PresetMinterPauserAutoId)
