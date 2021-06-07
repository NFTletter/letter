// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Letter is ERC721{

  // increment the identifiers for the tokens we mint.
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  // mapping for the IPFS hashes associated with tokens
  mapping (uint256 => string) private _tokenURIs;

  constructor() public ERC721("Letter", "LETT") {}

  // add new URI to tokenURI mapping
  function _setTokenURI(uint256 tokenId, string memory _tokenURI)
  internal
  virtual {
    require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
    _tokenURIs[tokenId] = _tokenURI;
  }

  // create a new Page
  function createPage(string memory _ipfsCID)
  public
  returns (uint256)
  {
    // ToDo: check _ipfsCID formatting

    _tokenIds.increment();
    uint256 newTokenId = _tokenIds.current();
    _tokenURIs[newTokenId] = _ipfsCID;
    
    _mint(msg.sender, newTokenId);

    return newTokenId;
  }

  // read tokenURI
  function tokenURI(uint256 tokenId) public
  view
  virtual
  override
  returns (string memory) {
    require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

    string memory base = "ipfs://";
    string memory _tokenURI = _tokenURIs[tokenId];

    return string(abi.encodePacked(base, _tokenURI));
  }
}
