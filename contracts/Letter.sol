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

    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;

    // Mapping owner address to token count
    mapping(address => uint256) private _balances;

    // ---------------------------------------
    // Initializer
    function initLetter(string memory _titleMint, string memory _firstPageMint, string memory _authorMint, address _owner)
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
        _mint(_owner, _pageNumber);
        emit letterInit(_owner, _titleMint, _authorMint);
        emit pageMint(_owner, _firstPageMint, _pageNumber);

        // save Page
        _pages.push(_firstPageMint);

        // Factory Contract + Owner are Admin
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(DEFAULT_ADMIN_ROLE, _owner);

        // Owner is Viewer
        grantRole(VIEWER_ROLE, _owner);

        // set Letter Contract Owner
        transferOwnership(_owner);

    }

    // ---------------------------------------
    // Access Control
    bytes32 private constant VIEWER_ROLE = keccak256("VIEWER");

    modifier onlyViewer() {
        if (!_open){
            require (hasRole(VIEWER_ROLE, msg.sender), "Restricted to Viewer Role");
        }
        _;
    }

    /// @dev Add an account to the Viewer role. Restricted to Owner.
    function addViewer(address _account)
    public
    virtual
    onlyOwner {
        grantRole(VIEWER_ROLE, _account);
    }

    /// @dev Remove an account from the Viewer role. Restricted to Owner.
    function removeViewer(address _account)
    public
    virtual
    onlyOwner {
        revokeRole(VIEWER_ROLE, _account);
    }

    /// @dev open Viewer Role (every account can View)
    function openView()
    public
    virtual
    onlyOwner {
        _open = true;
    }

    /// @dev close Viewer Role (only Viewer accounts can View)
    function closeView()
    public
    virtual
    onlyOwner {
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
    {
        // Page Body is mandatory, max 65536 characters
        require((getStringLength(_pageMint) != 0), "Cannot mint empty page");
        require((getStringLength(_pageMint) <= 65536), "Page max length: 65536");

        // Mint Page Token
        uint256 _pageNumber = _pages.length;
        _mint(msg.sender, _pageNumber);

        // save Page
        _pages.push(_pageMint);

    }

    /// @dev override
    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControlUpgradeable, ERC721Upgradeable) returns (bool) {
        return
            interfaceId == type(IAccessControlUpgradeable).interfaceId ||
            interfaceId == type(IERC721Upgradeable).interfaceId ||
            interfaceId == type(IERC721MetadataUpgradeable).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /// @dev override so that Page owner belongs to Viewer role
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data)
    public
    virtual
    override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        _safeTransfer(from, to, tokenId, _data);

       // New Page owner belongs to Viewer role
        _setupRole(VIEWER_ROLE, to);
    }

    /// @dev override so that Page owner belongs to Viewer role
    function transferFrom(address from, address to, uint256 tokenId)
    public
    virtual
    override {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");

        _transfer(from, to, tokenId);

        // New Page owner belongs to Viewer role
        _setupRole(VIEWER_ROLE, to);
    }

}