// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Letter.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

/// @title Letter Factory Contract
/// @author Bernardo A. Rodrigues
/// @notice Defines a Letter Factory, where new Clones of Letter Contract are deployed.
/// @dev Defines a Letter Factory, where new Clones of Letter Contract are deployed.
contract LetterFactory {

    // Letter Contact to be cloned
    address immutable _letterImplementation;

    // Keep track of deployed clones
    address[] private _letters;

    /// @notice LetterFactory Constructor. Creates reference Letter Contract.
    /// @dev LetterFactory Constructor. Creates reference Letter Contract.
    constructor() {
        _letterImplementation = address(new Letter());
    }

    /// @notice Creates a new Letter Contract Clone.
    /// @dev Creates a new Letter Contract Clone.
    /// @param _title Title of Letter to be created. Redirected to initLetter().
    /// @param _firstPage Contents of the 1st Letter Page to be created. Redirected to initLetter().
    /// @param _author Author Signature of the Letter (as in handwritten signature; NOT as in cryptographic signature). Redirected to initLetter().
    /// @return address Address of deployed Letter Contract Clone.
    function createLetter(string memory _title, string memory _firstPage, string memory _author)
    external
    returns (address) {
        address letterClone = Clones.clone(_letterImplementation);
        Letter(letterClone).initLetter(_title, _firstPage, _author, msg.sender);
        _letters.push(letterClone);
        return letterClone;
    }

    /// @notice Views how many Letter Contract Clones have been deployed.
    /// @dev Views how many Letter Contract Clones have been deployed.
    /// @return uint256 How many Letter Contract Clones have been deployed.
    function viewLetterCount()
    public
    view
    returns (uint256) {
        return _letters.length;
    }

    /// @notice Views some Letter Contract Clone's Address.
    /// @dev Views some Letter Contract Clone's Address.
    /// @param _letterN Id of Letter Contract Clone.
    /// @return address Address of Letter Contract Clone.
    function viewLetterAddr(uint256 _letterN)
    public
    view
    returns (address) {
        return _letters[_letterN];
    } 
}