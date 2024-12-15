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
    console.log("Deployers address :", deployer.address);
    console.log("Buyers address :", buyer.address);

    //deploying the contract
    const Dapp = await ethers.getContractFactory("Dzon");
    dApp = await Dapp.deploy();
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
      //  list of signers as the default deployer unless you explicitly specify a different account.
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

  })
});
