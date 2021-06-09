# 📜 Letter ✍️

## Introduction

**Letter** is an [ERC-721 Smart Contract](http://erc721.org/) that allows for the creation of **text-based NFTs**, meant for **written artistic expression**.


**Letter** allows for art pieces such as **poems**, **novels**, **manifestos** and **source code** to be minted as Non-Fungible Tokens into the [Ethereum](https://ethereum.org/en/) blockchain.


Each Non-Fungible Token represents a **Page**. Each Page has the following fields:

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
    <td class="tg-9wq8">Title</td>
    <td class="tg-9wq8">Title of the Page</td>
    <td class="tg-9wq8"><span style="font-style:italic">string (UTF-8)</td>
    <td class="tg-9wq8">yes</td>
  </tr>
  <tr>
    <td class="tg-9wq8">Body</td>
    <td class="tg-9wq8">Actual contents of the Page</td>
    <td class="tg-9wq8"><span style="font-style:italic">string (UTF-8)</td>
    <td class="tg-9wq8">no</td>
  </tr>
  <tr>
    <td class="tg-0lax">Rubric</td>
    <td class="tg-baqh">Author signature</td>
    <td class="tg-0lax">string (UTF-8)</td>
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

The NFT metadata representing each Page is encoded as a `.json` UTF-8 file to be pinned on [IPFS](https://ipfs.io/).

## Instructions

Instructions for deployment of a [Truffle](https://www.trufflesuite.com/)-based development environment.

1. Clone:
```
$ git clone https://github.com/NFTletter/letter.git
$ cd letter
```

2. Set the proper [Pinata](https://pinata.cloud) keys at `app/pinataConfig.json`. Make sure the API keys have access to the `pinJSONToIPFS` feature. For example:
```
$ cat << EOF > app/pinataConfig.json
{
  "APIKey": "89baeb2d3427f4b0a882",
  "SecretKey": "2f01fc70bf03dca7729c324070e00b146924825baf2cd105cb7f6a36e59a5d60"
}
EOF
```

3. Start Truffle and load the Smart Contract:
```
$ truffle develop
...
truffle(develop)> migrate
```

4. On a new terminal, then start the DApp:
```
$ cd letter/app
$ npm install --save
$ npm audit fix
$ npm run dev
```

## Roadmap

- [ ] Solidity Source Code (OpenZeppelin ERC-721).
- [ ] Minter Front-End.
- [ ] Display Front-End.
- [ ] Brownie tests.
- [ ] Testnet deployment.
- [ ] Natspec documentation.
- [ ] Make Contract upgradable.
- [ ] Automated Auditing.
- [ ] OpenSea Hello World Token validation.
- [ ] [Prepare for Mainnet](https://docs.openzeppelin.com/learn/preparing-for-mainnet).
- [ ] Mainnet deployment.

## References
 - [po.et](https://poetproject.medium.com/)
 - [OpenZeppelin Forum Post: Create an NFT and deploy to a public testnet, using Truffle](https://forum.openzeppelin.com/t/create-an-nft-and-deploy-to-a-public-testnet-using-truffle/2961)
 - [OpenSea ERC-721 Tutorial](https://docs.opensea.io/docs/1-structuring-your-smart-contract)
 - [OpenZeppelin ERC-721PresetMinterPauserAutoId ERC721 Preset](https://docs.openzeppelin.com/contracts/3.x/api/presets#ERC721PresetMinterPauserAutoId)
 - [How to Build ERC-721 NFTs with IPFS](https://medium.com/pinata/how-to-build-erc-721-nfts-with-ipfs-e76a21d8f914)
