// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Letter.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract LetterFactory {

    address immutable _letterImplementation;
    address[] private _letters;

    constructor() {
        _letterImplementation = address(new Letter());
    }

    function createLetter(string memory _title, string memory _firstPage, string memory _author)
    external
    returns (address) {
        address letterClone = Clones.clone(_letterImplementation);
        Letter(letterClone).initLetter(_title, _firstPage, _author, msg.sender);
        _letters.push(letterClone);
        return letterClone;
    }

    function viewLetterCount()
    public
    view
    returns (uint256) {
        return _letters.length;
    }

    function viewLetterAddr(uint256 _letterN)
    public
    view
    returns (address) {
        return _letters[_letterN];
    } 
}