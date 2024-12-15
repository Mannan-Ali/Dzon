// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Dzon {
    //was made to check expect only in test
    // string public name;

    address public owner;

    //defining my own datatype
    struct Item {
        uint256 id; //id of product
        string name; //name of product
        string category; //what category it fits
        string image; //image URL;
        uint256 cost; //amount of product
        uint256 rating;
        uint256 stock; //how much product available
    }
    //here to save the data to the blockchain we are using maps so we can access the values as key is always unique 
    //this has more advantage than this Item[] public items;(array instead of map) then in function calling items.push(Items(...)) (intestead of the memory part) and storing on bc 
    mapping(uint256 => Item) public items;
    constructor() {
        owner = msg.sender; //the deployer (who paid the gas fee)
    }

    //functions

    //List Products
    function list(
        uint256 _id, //id of product
        string memory _name, //name of product
        string memory _category, //what category it fits
        string memory _image, //image URL;
        uint256 _cost, //amount of product
        uint256 _rating,
        uint256 _stock
    ) public {
        //as Item is a reference type datatype
        //as memory is used it is not stored on the bc as its a local variable 
        Item memory item = Item(
            _id,
            _name,
            _category,
            _image,
            _cost,
            _rating,
            _stock
        );
        //now we are storing the item to map with key as id so it can be accessed afterwards
         items[_id] = item;
    }
    //Buy Products

    //Withdraw funds
}
