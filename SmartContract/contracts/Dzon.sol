// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Dzon {
    //was made to check expect only in test
    // string public name;

    address public owner;

    //struct

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

    //mappings

    //here to save the data to the blockchain we are using maps so we can access the values as key is always unique
    //this has more advantage than this Item[] public items;(array instead of map) then in function calling items.push(Items(...)) (intestead of the memory part) and storing on bc
    mapping(uint256 => Item) public items;

    //EVENT for Listing
    event List(string name, uint256 cost, uint256 quantity);//now this can be accessed in frontend its like returning json in backend with little extra benefits here like tracking on bc

    //Modifier : To only allow owner to list items 
    modifier chkWhoislisting() {
        //here msg.sender(might not be owner and if not owner then we will not allow to list item) is the one who will calling the list function
        //msg.sender is a special variable in Solidity that represents the address of the account that is calling (or interacting with) the contract. 
        //This could be the address of the user, another contract, or the owner of the contract.
        require(msg.sender == owner,"You are not allowed to list products");
        _;
    }
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
    ) public chkWhoislisting{
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
        emit List(_name, _cost, _stock);
        //0.Events are a way for smart contracts to communicate with the outside world
        // 1.SOMEONE FROM FRONTENT CAN SUSCIRBE TO THE EVENT IN ORDER TO GET A NOTIFICATION ABOUT IT LIKE ON PHONE ON FRONTEND
        // 2.VERY EASILY THIS CAN BE FOUND ON BLOCKCHAIN AND BLOCK WHEN IT WAS CALLED ANDSTUFF
    }


    //Buy Products
    //payable will allow the function to receive ether to buy the prodcut
    //buyer sends ehter from frontend(website) which goes in SC,now when the buyer pay for a product a Order id/xyz will be generated that will store their order
    function buyProduct(uint256 prod_id) public payable{ 

    }
    //Withdraw funds
}
