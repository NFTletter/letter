// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";

// Access Control
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

// Safe Math
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Letter is ERC721Upgradeable, Ownable, AccessControl {

    // Safely count tokenIds
    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;

    // Page struct
    struct Page {
        string body;
    }

    // Each page is a token
    mapping (uint256 => Page) private page;

    // Letter struct
    struct Letter {
        string title;
        Page[] pages;
        string author;
        bool openView;
    }

    // Contract's Letter
    Letter letter;

    function initialize()
    public
    initializer { 
        __ERC721_init("Letter", "LETT");

        // init empty Letter struct
        letter = Letter("", "", "", "");
    }


    // function mintLetter()

    // Access Control
    using Roles for Roles.Role;
    Roles.Role private _admins;
    Roles.Role private _viewers;

    // function mintAppendPage()

    /// @dev Return `true` if the account belongs to the Viewer role.
    function isAdmin(address _account)
    public
    virtual
    view
    returns (bool) {
        return has(_admins, _account);
    }

    /// @dev Return `true` if the account belongs to the Viewer role.
    function isViewer(address _account)
    public
    virtual
    view
    returns (bool) {

        // Letter has openView?
        if (letter.openView) {
            return true;
        }

        return hasRole(_viewers, _account);
    }

}