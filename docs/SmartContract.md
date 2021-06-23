# Smart Contract

`Letter.sol` is `ERC721Upgradeable`, while `LetterFactory.sol` specifies a *[Contract Cloning Factory](https://blog.openzeppelin.com/workshop-recap-cheap-contract-deployment-through-clones/)*.

Every time a new `Letter` is minted, a new *Contract Clone* is deployed, with logic residing the *Implementation Contract*, defined by `Letter.sol`.

A `Letter` has the following attributes:
- `string private _title`: max **64** characters, optionally empty.
- `string private _author`: max **64** characters, optionally empty.
- `string[] private _pages`, each array element represents a `Page`, with max **8192** characters per `Page`.
- `bool private _open`: represents whether `Reader` role is necessary to view `Letter` contents.

Each `Page` is a Non-Fungible Token (**NFT**) under the `Letter` *Contract Clone*.

## Ownership

Each `Letter` *Contract Clone* is `Ownable`.
Only the contract's `Owner` is able to mint new NFTs by appending new `Page`s to the `Letter`.

## Reader Role (Access Control)

The `Reader` role allows for some `account` to visualize the Letter Page Tokens.

The `onlyReader` modifier restricts access for the execution of the following functions:
- `viewTitle()`
- `viewBody(pageN)`
- `viewAuthor()`

The `_open` attribute of the `Letter` *Contract Clone* overwrites the behavior of this role.
If `isOpen() == true`, then `onlyReader` has no effect, and every `account` is able to view `Letter` contents.

The `onlyOwner` modifier restricts access for the execution of the following functions:
- `addReader(account)`
- `removeReader(account)`
- `open()`
- `close()`

Whenever the ownership for some `Page` is transferred from `addressA` to `addressB`, `addressB` automatically receives the `Reader` role for the entire `Letter`. The `Reader` role is kept forever on `addressB`, even if it ever transfers the ownership of such page to any other Address.

## Gas

The number of characters on each `Letter`'s `Title`, `Author` and `Page` contents determine Gas fees to be paid by the NFT minter.

Therefore, larger `Letter`s are more expensive to mint.

This economic dynamic discourages vandalism and meaningless NFTs.

### Benchmarks

The script [letterFactoryGasBenchmark.js](../scripts/letterFactoryGasBenchmark.js) performs a few Benchmarks to find out Gas consumption in relationship to the number of characters in a `Letter`.

#### Fixed Title + Author

The table below displays Gas consumption of `createLetter()`, where a `LetterFactory` deploys a `Letter` Contract Clone.

In order to keep dimensionality of data low, the `Title` and `Author` fields were fixed, and only `Page` Length was varied.

<table>
<thead>
  <tr>
    <th>First Page Length</th>
    <th>Gas Used</th>
    <th>ETH Cost @ 6.1 Gwei</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>1</td>
    <td>534406</td>
    <td>0.0032598766</td>
  </tr>
  <tr>
    <td>2</td>
    <td>517318</td>
    <td>0.0031556398</td>
  </tr>
  <tr>
    <td>4</td>
    <td>517342</td>
    <td>0.0031557862</td>
  </tr>
  <tr>
    <td>8</td>
    <td>517390</td>
    <td>0.0031560790</td>
  </tr>
  <tr>
    <td>16</td>
    <td>51748</td>
    <td>0.0031566646</td>
  </tr>
  <tr>
    <td>32</td>
    <td>539851</td>
    <td>0.0032930911</td>
  </tr>
  <tr>
    <td>64</td>
    <td>562972</td>
    <td>0.0034341292</td>
  </tr>
  <tr>
    <td>128</td>
    <td>609191</td>
    <td>0.0037160651</td>
  </tr>
  <tr>
    <td>256</td>
    <td>701634</td>
    <td>0.0042799674</td>
  </tr>
  <tr>
    <td>512</td>
    <td>886537</td>
    <td>0.0054078757</td>
  </tr>
  <tr>
    <td>1024</td>
    <td>1256349</td>
    <td>0.0076637289</td>
  </tr>
  <tr>
    <td>2048</td>
    <td>1996001</td>
    <td>0.0121756061</td>
  </tr>
  <tr>
    <td>4096</td>
    <td>3475412</td>
    <td>0.0212000132</td>
  </tr>
  <tr>
    <td>8192</td>
    <td>6434664</td>
    <td>0.0392514504</td>
  </tr>
</tbody>
</table>
<br>

#### Max Title + Page + Author

The table below displays Gas consumption of `createLetter()`, where a `LetterFactory` deploys a `Letter` Contract Clone.

The `Title`, `First Page` `Author` fields were fixed at their maximum allowed values.

<table>
<thead>
  <tr>
    <th>First Page Length</th>
    <th>Title Length</th>
    <th>Author Length</th>
    <th>Gas Used</th>
    <th>ETH Cost @ 6.1 Gwei</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>8192</td>
    <td>64</td>
    <td>64</td>
    <td>6435120</td>
    <td>0.039254232</td>
  </tr>
</tbody>
</table>
<br>


#### New Page

The table below displays Gas consumption of `mintPage()`, where a `LetterFactory` appends a new `Page` to some existing `Letter` Contract Clone.

<table>
<thead>
  <tr>
    <th>Page Length</th>
    <th>Gas Used</th>
    <th>ETH Cost @ 6.1 Gwei</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>1</td>
    <td>85093</td>
    <td>0.0005190673</td>
  </tr>
  <tr>
    <td>2</td>
    <td>85105</td>
    <td>0.0005191405</td>
  </tr>
  <tr>
    <td>4</td>
    <td>85129</td>
    <td>0.0005192869</td>
  </tr>
  <tr>
    <td>8</td>
    <td>85177</td>
    <td>0.0005195797</td>
  </tr>
  <tr>
    <td>16</td>
    <td>85273</td>
    <td>0.0005201653</td>
  </tr>
  <tr>
    <td>32</td>
    <td>107668</td>
    <td>0.0006567748</td>
  </tr>
  <tr>
    <td>64</td>
    <td>130362</td>
    <td>0.0007952082</td>
  </tr>
  <tr>
    <td>128</td>
    <td>175750</td>
    <td>0.001072075</td>
  </tr>
  <tr>
    <td>256</td>
    <td>266526</td>
    <td>0.0016258086</td>
  </tr>
  <tr>
    <td>512</td>
    <td>448078</td>
    <td>0.0027332758</td>
  </tr>
  <tr>
    <td>1024</td>
    <td>811186</td>
    <td>0.0049482346</td>
  </tr>
  <tr>
    <td>2048</td>
    <td>1537407</td>
    <td>0.0093781827</td>
  </tr>
  <tr>
    <td>4096</td>
    <td>2989874</td>
    <td>0.0182382314</td>
  </tr>
  <tr>
    <td>8192</td>
    <td>5894903</td>
    <td>0.0359589083</td>
  </tr>
</tbody>
</table>
<br>