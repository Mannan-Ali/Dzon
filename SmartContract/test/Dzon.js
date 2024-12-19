const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

/*
The function tokens(n) is a utility function that converts a number (n) into a BigNumber representing the value in wei (the smallest unit of Ethereum) using the Ether unit.

Here’s a breakdown of how it works:

1. n.toString():
This converts the input value n into a string.
It's necessary because ethers.parseUints expects a string input (or a number) to avoid issues with floating point precision.
2. ethers.parseUints():
parseUnits is a helper function from the ethers.js library that converts a given value (in ether) into its equivalent in wei.

The function takes two arguments:

The amount (n.toString()), which is the number or string you want to convert.
The unit ('ether'), which specifies the base unit (ether in this case). You could also use other units like 'gwei' or 'wei'.
'ether' refers to the Ether unit (1 Ether = 10^18 wei).

For example, 1 Ether = 1000000000000000000 wei.
What it does:
When you call tokens(n), it converts the value n (which represents Ether) into the equivalent number of wei.
*/
//USING THIS WE CAN EVEN GET THE POINT VALUES IN ETHER (AS WE DONT WE CANNOT DIRECLTY SPECIFY FLOATING POINT IN SOLIDITY )
//basically we are getting value n=> in ehter as base ='ether' specified in parseUnit
//now when passing a point value for like 0.5 ethers we change it to wei so it becomes a non floating 
//console.log(tokens(0.5)); // Outputs: BigNumber { value: "500000000000000000" }
const tokens = (n) => {
  return ethers.parseUnits(n.toString(), 'ether')
}


//TO MAKE IT GLOBALLY AVAILABLE
const ID = 1
const NAME = "Shoes"
const CATEGORY = "Clothing"
//getting url from ipfs 
const IMAGE = "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg"
const COST = tokens(1)//1 means 1 ether specified above in tokens function
const RATING = 4
const STOCK = 5

describe("Dzon", function () {

  let deployer, buyer, dApp;
  beforeEach(async () => {
    //get owners adrress
    [deployer, buyer] = await ethers.getSigners();
    // console.log("Deployers address :", deployer.address);
    // console.log("Buyers address :", buyer.address);

    //deploying the contract
    const Dapp = await ethers.getContractFactory("Dzon");
    dApp = await Dapp.deploy();//here it takes 1st acc from hardhat network as owner or msg.sender and we take the same acc in deployer also as you can see up
    // dApp = await Dapp.connect(deployer).deploy();
    /*
    Connect the contract instance to the deployer account
    const deployerContract = dApp.connect(deployer);

    connect binds a specific signer (an Ethereum account) to a contract instance.
    Once connected, any function calls made on the contract instance will be made from the connected signer's address.
     */
  });
  describe("Deployment Check : ", () => {
    it("Cheking the owner : ", async () => {
      // But you never specified the deployer! How does Hardhat decide?
      // (see up in the comments)Hardhat automatically uses the first account in the
      //  list of signers as the default unless you explicitly specify a different account
      //and as deployer is also specified as the first acc from singers so both should be same 
      expect(await dApp.owner()).to.equal(deployer.address);
    })
    //READ FOR HIW TO USE EXPECT
    // it("Cheking name : ", async function () {
    //   const { dApp } = await loadFixture(getOwner);
    //   // const name = await dApp.name();
    //   // console.log(name);
    //   //this one is better as it gives Behavior Validation also but console.log does not but up can be done too at some points
    //   // expect(name).to.equal("Dzon");
    //   expect(await dApp.name()).to.equal("Dzon");
    // });
  })

  describe("Listing of Products Check : ", () => {
    let transaction;
    beforeEach(async () => {
      // List a item
      //if you change deployer to buyer it wont work 
      // as we speiced in the modifier that only the deployer acc 
      // or more specifically the 1st acc that gets set when calling dApp.deploy() from hardhat netwrok
      //is stored in owner and owner == 1st acc (deployer) or else break 
      transaction = await dApp.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();
    })
    it("Cheking if the products are getting listed properly in maps : ", async () => {
      const item = await dApp.items(1);//getting the value where key =  1 in mapping ;
      expect(item.id).to.equal(ID);//checking (now item has all the values like id, name etc to get then we use dot)
      expect(item.name).to.equal(NAME);
      expect(item.category).to.equal(CATEGORY);
      expect(item.image).to.equal(IMAGE);
      expect(item.cost).to.equal(COST);
      expect(item.rating).to.equal(RATING);
      expect(item.stock).to.equal(STOCK);
      console.log(item);
    })

    it("Emits List event", async () => {
      expect(transaction).to.emit(dApp, "List")//.emit is used to check if an event was triggered during the execution of a transaction
    })
    // it("Should not allow non-owners to list products", async () => {
    //   // Trying to list by the buyer (non-owner)
    //   const x = await dApp.connect(buyer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
    // });
  })
  describe("Check Buying of Product : ", () => {
    let transaction,dAppAddress,initialBalance;
    beforeEach(async () => {
      //as a contract that you’re deploying, so you should get its address using this way not normal dApp.address
      //he dApp address refers to the smart contract's address on the blockchain.
      // How is it created?
      // When a smart contract is deployed on the blockchain, it is assigned a unique address by the Ethereum Virtual Machine (EVM).
      dAppAddress = await dApp.getAddress();
      //list item for to execute buy
      transaction = await dApp.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();
      //buy product call
      // ethers.provider.getBalance :is a function provided by the Ethers.js library to check the Ether balance of a given Ethereum address (e.g., a wallet or smart contract address).
      initialBalance = await ethers.provider.getBalance(dAppAddress);
      //In the Ethereum blockchain, when a transaction is sent to a smart contract, the sender can attach Ether to the transaction using the value field.
      //Note value parameter only accepts in wei value
      //the buyer can send any amount of ether(in wei) here it can be less
      transaction = await dApp.connect(buyer).buyProduct(ID,{ value : COST });
      await transaction.wait();
    })

    it("Updates the contracts balance ", async () => {
      console.log("Old Ethe value in contract acc : ",initialBalance);

      const newBalance = await ethers.provider.getBalance(dAppAddress);
      console.log("New Balance:", newBalance);

      const checkCost= newBalance - initialBalance;
      console.log("CheckCost Balance:", checkCost);
      
      // Check if the balance increased by COST
      expect(checkCost).to.equal(COST);
    })
    it("Checking if buyers Order count Updates ", async () => {
      const result = await dApp.orderCount(buyer.address)
      // Check if the balance increased by COST
      console.log("The value of Order Id is : ",result);
      expect(result).to.equal(1);
    })
    it("Checking if Order was added ", async () => {
      const order = await dApp.orders(buyer.address , 1);
      console.log(order);
      
      expect(order.item.name).to.equal(NAME);
      expect(order.time).to.greaterThan(0);
    })
  })
  describe("Checking Withdrawal function : ", ()=>{
    let transaction,dAppAddress,balanceBeforeWithdraw;
    beforeEach(async ()=>{
      dAppAddress = await dApp.getAddress();

      transaction = await dApp.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();

      transaction = await dApp.connect(buyer).buyProduct(ID,{ value : COST });
      await transaction.wait();
      
      balanceBeforeWithdraw = await ethers.provider.getBalance(deployer.address);

      transaction = await dApp.connect(deployer).withdraw();
      await transaction.wait();
    })
    it("Check Withdrawing of money : ",async ()=>{
      const balanceAfterWithdraw = await ethers.provider.getBalance(deployer.address);
      console.log(balanceBeforeWithdraw);  
      console.log(balanceAfterWithdraw);
      expect(balanceAfterWithdraw).to.be.gt(balanceBeforeWithdraw);
    })

    it("Check if any amount left in contract balance : ",async ()=>{
      const balanceInContract = await ethers.provider.getBalance(dAppAddress);
      console.log(balanceInContract);
      
      expect(balanceInContract).to.be.equal(0);
    })
  })
});
