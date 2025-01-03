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

    struct Order {
        uint256 time; //when was item purchase
        Item item; //nested struct
    }

    //mappings

    //here to save the data to the blockchain we are using maps so we can access the values as key is always unique
    //this has more advantage than this Item[] public items;(array instead of map) then in function calling items.push(Items(...)) (intestead of the memory part) and storing on bc
    mapping(uint256 => Item) public items;

    //here the address is the buyers wallet address and uint is numner of orders placed by the user
    //User places an order for 4 shoes.
    //orderCount[msg.sender] will increase by 1. If it was initially 0, it becomes 1.
    //here order number is seen not the amout of product
    mapping(address => uint256) public orderCount;

    //address is users wallet address, and uint is the number of the Order from OrderCount
    mapping(address => mapping(uint256 => Order)) public orders;

    //EVENT for Listing so the listing can be tracked easilya and also be received by the fronted .
    event List(string name, uint256 cost, uint256 quantity); //now this can be accessed in frontend its like returning json in backend with little extra benefits here like tracking on bc

    event Buy(address buyer, uint256 orderId, uint256 itemId);

    //Modifiers
    //Modifier : To only allow owner to list items
    modifier chkWhoisCalling() {
        //here msg.sender(might not be owner and if not owner then we will not allow to list item) is the one who will calling the list function
        //msg.sender is a special variable in Solidity that represents the address of the account that is calling (or interacting with) the contract.
        //This could be the address of the user, another contract, or the owner of the contract.
        require(msg.sender == owner, "You are not allowed to list products");
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
    ) public chkWhoisCalling {
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
    function buyProduct(uint256 prod_id) public payable {
        //fetch item from the bc
        Item memory item = items[prod_id];

        require(item.stock > 0, "Out of Stock.");
        //amount of ehter sent is sufficent to buy the product
        require(msg.value >= item.cost, "The amout is not sufficient");
        //block.timestamp is the epoch time like the one used in the block for findinng hash with nonce
        Order memory order = Order(block.timestamp, item); //we are stroring this time when the Oder is created

        //save order to chain
        //this becomes Order Unique ID
        orderCount[msg.sender]++; //how many times user has orderd the same product (that is determined by the id )
        orders[msg.sender][orderCount[msg.sender]] = order;
        /*
        eg:
        order 1: 
        ordered 4 shoes : so orderCount[msg.sender] = 1 from 0;
        
        order  2: 
        ordered 10 slipper : so orderCount[msg.sender] = 2 from 1;

        now see here we are just increment the value of orderCount regardless of diffferent product so to store unique orders like order of slippers and order of shoes differently we use
        orders[msg.sender][orderCount[1]] = order;//as shoes product is the first order unique id it gets 1,and also stores time and what product and extra information specided in the item
        orders[msg.sender][orderCount[2]] = order;//as sliper is the  second order unique id it gets 2;
        THIS WAY WE GET TOTAT ORDER BY AN WALLET (MMAP 1) AND UNIQUE ORDERS OF EACH PRODUCT (MAP2) 
         */

        //subtract the amout of stock from the items provided by the deployer/owner
        items[prod_id].stock = item.stock - 1;

        //emit a event
        emit Buy(msg.sender, orderCount[msg.sender], item.id);
    }

    //Withdraw funds
    //the money that is sent to the contract can we withdrawn by the owner here
    function withdraw() public chkWhoisCalling{
        //call is better than transfer but also riskyas gas is not specified here
        //here this is means the contract that contains the function and address(this) means contract address balance or ehter it has
        (bool success,) = owner.call{value:address(this).balance}("");//("") Means no data payload is included that is you are not calling any function from this part like receving ehter in here then using it to call other func
        require(success);
    }
}
