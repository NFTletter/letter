// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";

// Access Control
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

// Safe Math
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Letter is ERC721Upgradeable, OwnableUpgradeable, AccessControlUpgradeable {

    // Letter vars
    string private _title;
    string private _author;
    bool private _open;
    string[] private _pages; // Each page is a Token

    // Letter events
    event letterInit(address owner, string _titleMint, string _authorMint);
    event pageMint(address owner, string page, uint256 pageNumber);

    // ---------------------------------------
    // Initializer
    function initLetter(string memory _titleMint, string memory _firstPageMint, string memory _authorMint)
    public
    initializer {

        __ERC721_init("Letter", "LETT");__ERC721_init("Letter", "LETT");
        __Ownable_init();
        
        // Page Body is mandatory, max 65536 characters
        require((getStringLength(_firstPageMint) != 0), "Cannot mint Letter with an empty first Page");
        require((getStringLength(_firstPageMint) <= 65536), "Page max length: 65536");

        // Page Title is optional, max 64 characters
        if (getStringLength(_titleMint) != 0) {
            require((getStringLength(_titleMint) <= 64), "Title max length: 64");
            _title = _titleMint;
        }
        
        // Page Author is optional, max 64 characters
        if (getStringLength(_authorMint) != 0) {
            require((getStringLength(_authorMint) <= 64), "Author max length: 64");
            _author = _authorMint;
        }

        // Mint first Page
        uint256 _pageNumber = _pages.length;
        _mint(msg.sender, _pageNumber);
        emit letterInit(msg.sender, _titleMint, _authorMint);
        emit pageMint(msg.sender, _firstPageMint, _pageNumber);

        // save Page
        _pages.push(_firstPageMint);

        // Owner is Admin
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        grantRole(ADMIN_ROLE, msg.sender);

        // Owner is Viewer
        grantRole(VIEWER_ROLE, msg.sender);
    }

    // ---------------------------------------
    // Access Control
    bytes32 private constant ADMIN_ROLE = keccak256("ADMIN");
    bytes32 private constant VIEWER_ROLE = keccak256("VIEWER");

    modifier onlyViewer() {
        if (!_open){
            require (hasRole(VIEWER_ROLE, msg.sender), "Restricted to Viewer Role");
        }
        _;
    }

    /// @dev Add an account to the Admin role of _letterId. Restricted to Admins.
    function addAdmin(address _account)
    public
    virtual
    onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(ADMIN_ROLE, _account);
    }

    /// @dev Remove oneself from the admin role.
    function renounceAdmin()
    public
    virtual {
        renounceRole(ADMIN_ROLE, msg.sender);
    }

    /// @dev Add an account to the Viewer role. Restricted to Admins.
    function addViewer(address _account)
    public
    virtual
    onlyRole(ADMIN_ROLE) {
        grantRole(VIEWER_ROLE, _account);
    }

    /// @dev Remove an account from the Viewer role. Restricted to admins.
    function removeViewer(address _account)
    public
    virtual
    onlyRole(ADMIN_ROLE) {
        revokeRole(VIEWER_ROLE, _account);
    }

    /// @dev open Viewer Role (every account can View)
    function openView()
    public
    virtual
    onlyRole(ADMIN_ROLE) {
        _open = true;
    }

    /// @dev close Viewer Role (only Viewer accounts can View)
    function closeView()
    public
    virtual
    onlyRole(ADMIN_ROLE) {
        _open = false;
    }

    // ---------------------------------------
    // View functions
    
    /// @dev view Title
    function viewTitle()
    public
    view
    onlyViewer
    returns (string memory) {
        return _title;
    }

    // @dev view Author
    function viewAuthor()
    public
    view
    onlyViewer
    returns (string memory) { 
        return _author;
    }

    // @dev view Page
    function viewPage(uint256 _pageN)
    public
    view
    onlyViewer
    returns (string memory) {
        require ((_pageN < _pages.length), "Can't view non-existent Page");
        return _pages[_pageN];
    }

    // @dev view Page Count
    function viewPageCount()
    public
    view
    onlyViewer
    returns (uint256) {
        return _pages.length;
    }

    // @dev is open?
    function isOpen()
    public
    view
    returns (bool) {
        return _open;
    }

    // ---------------------------------------
    // Utility functions

    /// @dev count string length
    function getStringLength(string memory _s) 
    private
    pure
    returns (uint) {
        bytes memory bs = bytes(_s);
        return bs.length;
    }

    // ---------------------------------------
    // Mint new Page function

    /// @dev mint new Page, append to Letter
    function mintAppendPage(string memory _pageMint)
    public
    onlyOwner
    returns (uint256)
    {
        // Page Body is mandatory, max 65536 characters
        require((getStringLength(_pageMint) != 0), "Cannot mint empty page");
        require((getStringLength(_pageMint) <= 65536), "Page max length: 65536");

        // Mint Page Token
        uint256 _pageNumber = _pages.length;
        _mint(msg.sender, _pageNumber);

        // save Page
        _pages.push(_pageMint);

        // Return minted Page Number
        return _pageNumber;
    }

    /// @dev override
    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControlUpgradeable, ERC721Upgradeable) returns (bool) {
        return
            interfaceId == type(IAccessControlUpgradeable).interfaceId ||
            interfaceId == type(IERC721Upgradeable).interfaceId ||
            interfaceId == type(IERC721MetadataUpgradeable).interfaceId ||
            super.supportsInterface(interfaceId);
    }

}