# 📜 Letter ✍️

## Introduction

**Letter** is an [ERC-721 Smart Contract](http://erc721.org/) that allows for the creation of **text-based NFTs**, meant for **written artistic expression**.


**Letter** allows for art pieces such as **poems**, **novels**, **manifestos** and **source code** to be minted as Non-Fungible Tokens into the [Ethereum](https://ethereum.org/en/) blockchain.


Each Non-Fungible Token represents a **Page**. The NFT metadata representing each Page is encoded as a `.json` UTF-8 file to be pinned on [IPFS](https://ipfs.io/).

Each Page follows this JSON Schema:

```
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "http://github.com/NFTletter/letter/json/example.json",
  "type": "object",
  "title": "NFT Letter Page Schema",
  "description": "JSON Schema for NFT Pages on Letter ERC721.",
  "default": {},
  "examples": [
      {
          "title": "𝔥𝔢𝔩𝔩𝔬 𝔴𝔬𝔯𝔩𝔡",
          "body": "𝔯𝔬𝔰𝔢𝔰 𝔞𝔯𝔢 𝔯𝔢𝔡, 𝔳𝔦𝔬𝔩𝔢𝔱𝔰 𝔞𝔯𝔢 𝔟𝔩𝔲𝔢.",
          "author": "𝓢𝓱𝓪𝓴𝓮𝓼𝓹𝓮𝓪𝓻𝓮",
          "parent": 1337
      }
  ],
  "properties": {
      "title": {
          "$id": "#/properties/title",
          "type": "string",
          "title": "Page Title",
          "description": "Optional field representing NFT Page Title.",
          "minLength": 1,
          "maxLength": 64,
          "default": "",
          "examples": [
              "𝔥𝔢𝔩𝔩𝔬 𝔴𝔬𝔯𝔩𝔡"
          ]
      },
      "body": {
          "$id": "#/properties/body",
          "type": "string",
          "title": "Page Body",
          "description": "Mandatory field representing NFT Page Body.",
          "minLength": 1,
          "maxLength": 65536,
          "default": "",
          "examples": [
              "𝔯𝔬𝔰𝔢𝔰 𝔞𝔯𝔢 𝔯𝔢𝔡, 𝔳𝔦𝔬𝔩𝔢𝔱𝔰 𝔞𝔯𝔢 𝔟𝔩𝔲𝔢."
          ]
      },
      "author": {
          "$id": "#/properties/author",
          "type": "string",
          "title": "Page Author",
          "description": "Optional field representing NFT Page Author.",
          "minLength": 1,
          "maxLength": 64,
          "default": "",
          "examples": [
              "𝓢𝓱𝓪𝓴𝓮𝓼𝓹𝓮𝓪𝓻𝓮"
          ]
      },
      "parent": {
          "$id": "#/properties/parent",
          "type": "integer",
          "title": "Parent Page Token Id",
          "description": "Optional field representing NFT Parent Page Token Id.",
          "minimum": 1,
          "maximum": 115792089237316195423570985008687907853269984665640564039457584007913129639935,
          "default": 0,
          "examples": [
              1337
          ]
      }
  },
  "required": [
    "body"
  ]
}
```


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

⚠️ **Warning** ⚠️

The keys above are fictitious and only exist for illustration purposes. The `SecretKey` is sensitive, so be extra careful with `app/pinataConfig.json`!

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
- [ ] Minter Front+Back End.
- [ ] Display Front+Back End.
- [ ] Brownie tests.
- [ ] Testnet deployment.
- [ ] Make Contract upgradable.
- [ ] Automated Auditing.
- [ ] Natspec documentation.
- [ ] [Prepare for Mainnet](https://docs.openzeppelin.com/learn/preparing-for-mainnet).
- [ ] Mainnet deployment.

## References
 - [po.et](https://poetproject.medium.com/)
 - [OpenZeppelin Forum Post: Create an NFT and deploy to a public testnet, using Truffle](https://forum.openzeppelin.com/t/create-an-nft-and-deploy-to-a-public-testnet-using-truffle/2961)
 - [OpenSea ERC-721 Tutorial](https://docs.opensea.io/docs/1-structuring-your-smart-contract)
 - [OpenZeppelin ERC-721PresetMinterPauserAutoId ERC721 Preset](https://docs.openzeppelin.com/contracts/3.x/api/presets#ERC721PresetMinterPauserAutoId)
 - [How to Build ERC-721 NFTs with IPFS](https://medium.com/pinata/how-to-build-erc-721-nfts-with-ipfs-e76a21d8f914)
