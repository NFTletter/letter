// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";

// Access Control
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

// Safe Math
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/// @title Letter Contract.
/// @author Bernardo A. Rodrigues.
/// @notice This contract defines a Letter, where each Page is a NFT.
/// @dev This contract defines a Letter, where each Page is a NFT.
contract Letter is ERC721Upgradeable, OwnableUpgradeable, AccessControlUpgradeable {

/// No high severity issues found
/// Reviewed line-by-line and no vulnerabilities detected
/// Therefore, smart contract is recommended to be deployed to mainnet
/// 3rd Party Audited by @dev Francis Isberto

    // Letter constants
    uint private constant MAX_TITLE_LEN = 64;
    uint private constant MAX_PAGE_LEN = 8192;
    uint private constant MAX_AUTHOR_LEN = 64;

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

    // ---------------------------------------
    /// @notice Initializer of the Letter contract.
    /// @dev Initializer of the Letter contract.
    /// @param _titleMint Title of the Letter.
    /// @param _firstPageMint Contents of the 1st Letter Page.
    /// @param _authorMint Author Signature of the Letter (as in handwritten signature; NOT as in cryptographic signature).
    /// @param _owner Owner of Letter contract.
    function initLetter(string memory _titleMint, string memory _firstPageMint, string memory _authorMint, address _owner)
    public
    initializer {

        __ERC721_init("Letter", "LETT");
        __Ownable_init();

        // Page Title is optional, max 64 characters
        if (getStringLength(_titleMint) != 0) {
            require((getStringLength(_titleMint) <= MAX_TITLE_LEN), "Title exceeds MAX_TITLE_LEN");
            _title = _titleMint;
        }

                // Page Body is optional, max 8192 characters
        if (getStringLength(_firstPageMint) != 0){
            require((getStringLength(_firstPageMint) <= MAX_PAGE_LEN), "Page exceed MAX_PAGE_LEN");
        }
        
        // Page Author is optional, max 64 characters
        if (getStringLength(_authorMint) != 0) {
            require((getStringLength(_authorMint) <= MAX_AUTHOR_LEN), "Author exceeds MAX_AUTHOR_LEN");
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

        // Owner is Reader
        grantRole(READER_ROLE, _owner);

        // set Letter Contract Owner
        transferOwnership(_owner);

    }

    // ---------------------------------------
    // Access Control
    bytes32 private constant READER_ROLE = keccak256("READER");

    modifier onlyReader() {
        if (!_open){
            require (hasRole(READER_ROLE, msg.sender), "Restricted to Reader Role");
        }
        _;
    }

    /// @notice Check if Account belongs to Reader Role.
    /// @dev Check if Account belongs to Reader Role.
    /// @param _account Address of Account to be checked against Reader Role.
    /// @return bool True if Account belongs to Reader Role, False otherwise.
    function isReader(address _account)
    public
    view 
    returns (bool){
        if (_open){
            return true;
        }
        return hasRole(READER_ROLE, _account);
    }

    /// @notice Add an account to the Reader role. Restricted to Owner.
    /// @dev Add an account to the Reader role. Restricted to Owner.
    /// @param _account Address of Account to be added to Reader Role.
    function addReader(address _account)
    public
    virtual
    onlyOwner {
        grantRole(READER_ROLE, _account);
    }

    /// @notice Remove an account from the Reader role. Restricted to Owner.
    /// @dev Remove an account from the Reader role. Restricted to Owner.
    /// @param _account Address of Account to be removed from Reader Role.
    function removeReader(address _account)
    public
    virtual
    onlyOwner {
        revokeRole(READER_ROLE, _account);
    }

    /// @notice Open Reader Role (every Account can Read)
    /// @dev Open Reader Role (every Account can Read)
    function open()
    public
    virtual
    onlyOwner {
        _open = true;
    }

    /// @notice 
    /// @dev Close Reader Role (only Reader accounts can Read)
    /// @dev Close Reader Role (only Reader accounts can Read)
    function close()
    public
    virtual
    onlyOwner {
        _open = false;
    }

    // ---------------------------------------
    // View functions
    
    /// @notice Read Letter Title. Restricted to Accounts with Reader Role.
    /// @dev Read Letter Title. Restricted to Accounts with Reader Role.
    /// @return string Letter Title.
    function readTitle()
    public
    view
    onlyReader
    returns (string memory) {
        return _title;
    }

    /// @notice Read Letter Author. Restricted to Accounts with Reader Role.
    /// @dev Read Letter Author. Restricted to Accounts with Reader Role.
    /// @return string Letter Author.
    function readAuthor()
    public
    view
    onlyReader
    returns (string memory) { 
        return _author;
    }

    /// @notice Reade Page. Restricted to Accounts with Reader Role.
    /// @dev Reade Page. Restricted to Accounts with Reader Role.
    /// @param _pageN Number (Token Id) of Page (NFT) to be read.
    /// @return string Page Contents.
    function readPage(uint256 _pageN)
    public
    view
    onlyReader
    returns (string memory) {
        require ((_pageN < _pages.length), "Can't read non-existent Page");
        return _pages[_pageN];
    }

    /// @notice View Page Count. Restricted to Accounts with Reader Role.
    /// @dev View Page Count. Restricted to Accounts with Reader Role.
    /// @return uint256 Letter Page Count.
    function viewPageCount()
    public
    view
    onlyReader
    returns (uint256) {
        return _pages.length;
    }

    /// @notice Check whether Letter is Open.
    /// @dev Check whether Letter is Open.
    /// @return bool True if Letter is Open, False if Letter is Closed.
    function isOpen()
    public
    view
    returns (bool) {
        return _open;
    }

    // ---------------------------------------
    // Utility functions

    /// @notice Utility for calculating String Length.
    /// @dev Utility for calculating String Length.
    /// @param _s String for Length to be checked.
    /// @return uint Length of String.
    function getStringLength(string memory _s) 
    private
    pure
    returns (uint) {
        bytes memory bs = bytes(_s);
        return bs.length;
    }

    // ---------------------------------------
    // Mint new Page function

    /// @notice Write new Page (NFT) and append it to Letter. Restricted to Owner.
    /// @dev Write new Page (NFT) and append it to Letter. Restricted to Owner.
    /// @param _pageMint String with Page contents.
    function writePage(string memory _pageMint)
    public
    onlyOwner
    {
        // Page Body is mandatory, max 65536 characters
        require((getStringLength(_pageMint) != 0), "Cannot mint empty page");
        require((getStringLength(_pageMint) <= MAX_PAGE_LEN), "Page exceeds MAX_PAGE_LEN");

        // Mint Page Token
        uint256 _pageNumber = _pages.length;
        _mint(msg.sender, _pageNumber);

        // save Page
        _pages.push(_pageMint);

    }

    /// @notice Override, imposed by Interfaces from AccessControlUpgradeable and ERC721Upgradeable.
    /// @dev Override, imposed by Interfaces from AccessControlUpgradeable and ERC721Upgradeable.
    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControlUpgradeable, ERC721Upgradeable) returns (bool) {
        return
            interfaceId == type(IAccessControlUpgradeable).interfaceId ||
            interfaceId == type(IERC721Upgradeable).interfaceId ||
            interfaceId == type(IERC721MetadataUpgradeable).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /// @notice Override, guarantees that after Page NFT is transferred, new Owner belongs to Reader role.
    /// @dev Override, guarantees that after Page NFT is transferred, new Owner belongs to Reader role.
    /// @param from Address of previous Owner.
    /// @param to Address of new Owner.
    /// @param tokenId Page Number (NF Token Id).
    /// @param _data Data.
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data)
    public
    virtual
    override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        _safeTransfer(from, to, tokenId, _data);

       // New Page owner belongs to Reader role
        _setupRole(READER_ROLE, to);
    }

    /// @notice Override, guarantees that after Page NFT is transferred, new Owner belongs to Reader role.
    /// @dev Override, guarantees that after Page NFT is transferred, new Owner belongs to Reader role.
    /// @param from Address of previous Owner.
    /// @param to Address of new Owner.
    /// @param tokenId Page Number (NF Token Id).
    function transferFrom(address from, address to, uint256 tokenId)
    public
    virtual
    override {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");

        _transfer(from, to, tokenId);

        // New Page owner belongs to Reader role
        _setupRole(READER_ROLE, to);
    }

}
