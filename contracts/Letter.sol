// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Letter is ERC721 {

  constructor() public ERC721("Letter", "LETT") {}

  struct Page {
    string title;
    string body;
    string rubric;
  }

  // Correspondance between each tokenId and its struct Page
  mapping (uint256 => Page) private page;             

  // A Letter is defined as a Linked List of Pages.
  // Each Letter is identified by it's head Page's tokenId. 
  mapping (uint256 => uint256) private letterId;      // which Letter each Page belongs to?
  mapping (uint256 => uint256) private parentTokenId; // what's the Page's ParentTokenId?
  mapping (uint256 => uint256) private tailId;        // what's the Letter's tail tokenId?

  // Safely count tokenIds
  using Counters for Counters.Counter;
  Counters.Counter private tokenIds;

  // Count String Length
  function getStringLength(string memory _s) 
  private
  view
  returns (uint) {
    bytes memory bs = bytes(_s);
    return bs.length;
  }

  // Safely count Pages
  using SafeMath for uint256;

  // Calculate Page Number
  function getPageNumber(uint256 _tokenId)
  public
  view
  returns (uint256)
  {
    
    // Page must exist
    require((letterId[_tokenId] != 0), "Cannot get Number of non-existent Page");

    uint256 iLetterId = letterId[_tokenId];
    uint256 iTokenId = _tokenId;
    uint256 counter = 0;

    while (iLetterId != iTokenId) {
      iTokenId = parentTokenId[iTokenId];
      counter = counter.add(1);
    }

    return counter;
  }

  // Mint new Letter
  function mintLetter(string memory _title, string memory _body, string memory _rubric)
  public
  returns (uint256)
  {

    // Page Body is mandatory
    require((getStringLength(_body) != 0), "Cannot mint without a body");

    // Create new empty struct Page
    Page memory newPage = Page("", "", "");

    // Page Title is optional, max 64 characters
    if (getStringLength(_title) != 0) {
      require((getStringLength(_title) <= 64), "Title max length: 64");
      newPage.title = _title;
    }
    
    // Page Rubric is optional, max 64 characters
    if (getStringLength(_rubric) != 0) {
      require((getStringLength(_rubric) <= 64), "Rubric max length: 64");
      newPage.rubric = _rubric;
    }

    // Page Body is max 65536 characters
    require((getStringLength(_title) <= 65536), "Body max length: 65536");
    newPage.body = _body;

    // Create new Token
    uint256 newTokenId = tokenIds.current();
    tokenIds.increment();

    // Associate Token to struct Page
    page[newTokenId] = newPage;

    // Start new Letter
    letterId[newTokenId] = newTokenId;
    tailId[newTokenId] = newTokenId;

    // Mint Token
    _mint(msg.sender, newTokenId);

    // Return minted Page Token Id
    return newTokenId;

  }

  // Mint new Page, append to some existing Letter
  function mintAppendPage(uint256 _letterId, string memory _title, string memory _body, string memory _rubric)
  public
  returns (uint256)
  {

    // Letter must exist
    require((letterId[_letterId] != 0), "Cannot mint Page with non-existent letterId");

    // ToDo: require ownership of letterId

    // Page Body is mandatory
    require((getStringLength(_body) != 0), "Cannot mint Page without a body");

    // Create new empty struct Page
    Page memory newPage = Page("", "", "");

    // Page Title is optional, max 64 characters
    if (getStringLength(_title) != 0) {
      require((getStringLength(_title) <= 64), "Page Title max length: 64");
      newPage.title = _title;
    }
    
    // Page Rubric is optional, max 64 characters
    if (getStringLength(_rubric) != 0) {
      require((getStringLength(_rubric) <= 64), "Page Rubric max length: 64");
      newPage.rubric = _rubric;
    }

    // Page Body is max 65536 characters
    require((getStringLength(_title) <= 65536), "Page Body max length: 65536");
    newPage.body = _body;

    // Create new Token
    uint256 newTokenId = tokenIds.current();
    tokenIds.increment();

    // Update Letter Linked List
    parentTokenId[newTokenId] = tailId[_letterId];
    tailId[_letterId] = newTokenId;

    // Set new Token's letterId
    letterId[newTokenId] = _letterId;

    // Associate Token to struct Page
    page[newTokenId] = newPage;

    // Mint Token
    _mint(msg.sender, newTokenId);

    // Return minted Page Token Id
    return newTokenId;

  }

  // ToDo: remove tokenURI field?
}