// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Letter.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract LetterFactory {

    address immutable letterImplementation;

    constructor() {
        letterImplementation = address(new Letter());
    }

    function createLetter(string memory _title, string memory _firstPage, string memory _author)
    external
    returns (address) {
        address letterClone = Clones.clone(letterImplementation);
        Letter(letterClone).initLetter(_title, _firstPage, _author, msg.sender);
        return letterClone;
    }
}