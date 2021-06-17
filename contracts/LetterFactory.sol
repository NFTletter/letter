// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Letter.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract LetterFactory {

    address immutable letterImplementation;

    constructor() {
        letterImplementation = address(new Letter());
    }

    function createLetter(string memory _titleMint, string memory _firstPageMint, string memory _authorMint)
    external
    returns (address) {
        address letterClone = Clones.clone(letterImplementation);
        Letter(letterClone).initLetter(_titleMint, _firstPageMint, _authorMint);
        return letterClone;
    }
}