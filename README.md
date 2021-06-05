# 📜 Letter ✍️

## Introduction

**Letter** is an [ERC-721 Smart Contract](https://eips.ethereum.org/EIPS/eip-721) that allows for the creation of **text-based NFTs**, meant for **written artistic expression**.


**Letter** allows for art pieces such as **poems**, **novels**, **manifestos** and **source code** to be minted as Non-Fungible Tokens into the [Ethereum](https://ethereum.org/en/) blockchain.


Each Non-Fungible Token represents a Page. The NFT metadata is encoded as a `.json` file to be pinned on [IPFS](https://ipfs.io/):

<table class="tg">
<thead>
  <tr>
    <th class="tg-roi2">Field<br></th>
    <th class="tg-roi2">Description</th>
    <th class="tg-roi2">Encoding</th>
    <th class="tg-roi2">Optional?</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-9wq8">Id</td>
    <td class="tg-9wq8">Page/Token Id</td>
    <td class="tg-9wq8"><span style="font-style:italic">uint256</span></td>
    <td class="tg-9wq8">no</td>
  </tr>
  <tr>
    <td class="tg-9wq8">Nonce</td>
    <td class="tg-9wq8">Page number</td>
    <td class="tg-9wq8"><span style="font-style:italic">uint256</span></td>
    <td class="tg-9wq8">no</td>
  </tr>
  <tr>
    <td class="tg-9wq8">Title</td>
    <td class="tg-9wq8">Title of the Page</td>
    <td class="tg-9wq8"><span style="font-style:italic">ipfs://cid</span> for <span style="font-style:italic">.txt</span> (UTF-8)</td>
    <td class="tg-9wq8">yes</td>
  </tr>
  <tr>
    <td class="tg-9wq8">Body</td>
    <td class="tg-9wq8">Actual contents of the Page</td>
    <td class="tg-9wq8"><span style="font-style:italic">ipfs://cid</span> for <span style="font-style:italic">.txt</span> (UTF-8)</td>
    <td class="tg-9wq8">no</td>
  </tr>
  <tr>
    <td class="tg-0lax">Rubric</td>
    <td class="tg-baqh">Author signature</td>
    <td class="tg-0lax"><span style="font-style:italic">ipfs://cid </span>for <span style="font-style:italic">.txt</span> (UTF-8)</td>
    <td class="tg-baqh">yes</td>
  </tr>
  <tr>
    <td class="tg-9wq8">Parent</td>
    <td class="tg-9wq8">Id of parent Page/Token</td>
    <td class="tg-9wq8"><span style="font-style:italic">uint256</span></td>
    <td class="tg-9wq8">yes</td>
  </tr>
</tbody>
</table>

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

- [ ] Solidity Source Code (OpenZeppelin ERC-721).
- [ ] Metadata API for IPFS storage.
- [ ] Minter Front-End.
- [ ] Display Front-End.
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
 - [How to Build ERC-721 NFTs with IPFS](https://medium.com/pinata/how-to-build-erc-721-nfts-with-ipfs-e76a21d8f914)
