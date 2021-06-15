// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Access Control
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

// Safe Math
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Letter is ERC721, Ownable, AccessControlEnumerable {

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

  // Safely keep track of letterIds
  mapping (uint256 => bool) private letterIds;

  /// @dev Return letterId for some tokenId
  function getLetterId(uint256 _tokenId)
  public
  view
  returns (uint256) {
    
    // Page must exist
    require((letterId[_tokenId] != 0), "Cannot get letterId of non-existent Page");

    return letterId[_tokenId];
  }

  /// @dev Return `true` if the account belongs to the Viewer role.
  function isAdmin(address _account, uint256 _tokenId)
  public
  virtual
  view
  returns (bool) {
    uint256 memory _letterId = letterId[_tokenId];
    bytes32 memory _adminId = keccak256("ADMIN" + _letterId);

    return hasRole(_adminId, _account);
  }

  /// @dev Return `true` if the account belongs to the Viewer role.
  function isViewer(address _account, uint256 _tokenId)
  public
  virtual
  view
  returns (bool) {
    uint256 memory _letterId = letterId[_tokenId];
    bytes32 memory _viewerId = keccak256("VIEWER" + _letterId);

    // Open Viewer Role?
    if (isViewer(0, _letterId)) {
      return true;
    }

    return hasRole(_viewerId, _account);
  }

    modifier onlyAdmin() {
    require (isAdmin(msg.sender), "Restricted to Admins");
    _;
  }

  modifier onlyViewer() {
    require (isViewer(msg.sender), "Restricted to Viewers");
    _;
  }

  /// @dev Add an account to the Admin role of _letterId. Restricted to Admins.
  function addAdmin(address _account, uint256 _letterId)
  public
  virtual
  onlyAdmin {
    require((letterIds[_letterId] == letterId, "Invalid letterId"));

    bytes32 memory _adminId = keccak256("ADMIN" + _letterId);

    grantRole(_adminId, _account);
  }

  /// @dev Add an account to the Viewer role. Restricted to Admins.
  function addViewer(address _account, uint256 _letterId)
  public
  virtual
  onlyAdmin {
    require((letterIds[_letterId] == letterId, "Invalid letterId"));

    bytes32 memory _viewerId = keccak256("VIEWER" + _letterId);

    grantRole(_viewerId, _account);
  }

  /// @dev Remove an account from the Viewer role. Restricted to admins.
  function revokeViewer(address _account, uint256 _letterId)
  public
  virtual
  onlyAdmin {
    require((letterIds[_letterId] == letterId, "Invalid letterId"));

    bytes32 memory _viewerId = keccak256("VIEWER" + _letterId);

    revokeRole(_viewerId, _account);
  }

  /// @dev open Viewer Role (every account can View)
  function openViewer(uint256 _letterId)
  public
  virtual
  onlyAdmin  {
    require((letterIds[_letterId] == letterId, "Invalid letterId"));

    bytes32 memory _viewerId = keccak256("VIEWER" + _letterId);
    
    grantRole(_viewerId, 0);
  }

  /// @dev close Viewer Role (only Viewers can View)
  function openViewer(uint256 _letterId)
  public
  virtual
  onlyAdmin  {
    require((letterIds[_letterId] == letterId, "Invalid letterId"));

    bytes32 memory _viewerId = keccak256("VIEWER" + _letterId);
    
    revokeRole(_viewerId, 0);
  }
  
  /// @dev Remove oneself from the admin role.
  function renounceAdmin(uint256 _letterId)
  public
  virtual {
    require((letterIds[_letterId] == letterId, "Invalid letterId"));

    bytes32 memory _adminId = keccak256("ADMIN" + _letterId);

    renounceRole(_adminId, msg.sender);
  }

  // View Title
  function viewTitle(uint256 _letterId)
  public
  view
  onlyViewer
  returns (string) {
    return page[_letterId].title;
  }

  // View Body
  function viewBody(uint256 _letterId)
  public
  view
  onlyViewer
  returns (string) {
    return page[_letterId].body;
  }

  // View Rubric
  function viewRubric(uint256 _letterId)
  public
  view
  onlyViewer
  returns (string) {
    return page[_letterId].rubric;
  }

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

    letterIds[newTokenId] = true;

    // Associate Token to struct Page
    page[newTokenId] = newPage;

    // Start new Letter
    letterId[newTokenId] = newTokenId;
    tailId[newTokenId] = newTokenId;

    // Mint Token
    _mint(msg.sender, newTokenId);

    // Owner is admin
    bytes32 _adminId = keccak256("ADMIN" + newTokenId);
    grantRole(_adminId, msg.sender);

    // Owner is the only viewer
    bytes32 _viewerId = keccak256("VIEWER" + newTokenId);
    grantRole(_viewerId, msg.sender);

    // Return minted Page Token Id
    return newTokenId;

  }

  // Mint new Page, append to some existing Letter
  function mintAppendPage(uint256 _letterId, string memory _title, string memory _body, string memory _rubric)
  public
  onlyOwner
  returns (uint256)
  {

    // Letter must exist
    require((letterId[_letterId] != 0), "Cannot mint Page with non-existent letterId");

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

}