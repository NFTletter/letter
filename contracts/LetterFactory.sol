// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Letter.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

// contract LetterFactory is Clones {

//     address public implementationLetter;

//     constructor(address _implementationLetter) public {
//         implmentationLetter = _implementationLetter;
//     }

//     function createLetter(bytes memory _data)
//     public
//     returns (address) {
//         address proxy = deployMinimal(implementationLetter, _data);
//         return proxy;
//     }
// }