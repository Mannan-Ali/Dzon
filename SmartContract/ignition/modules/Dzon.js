// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition



// Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
// Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

// Helper function to convert tokens

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { items } = require("../parameters.json");

module.exports = buildModule("DzonModule", (m) => {

  const DzonApp = m.contract("Dzon");

  // Sample item data (replace with your actual data or a way to fetch it)
  // const ID = 1;
  // const NAME = "Shoes";
  // const CATEGORY = "Clothing";
  // const IMAGE = "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg";
  // const COST = ethers.parseUnits("1", "wei"); // 1 ether
  // const RATING = 4;
  // const STOCK = 5;
  // console.log("Items fetched from parameters:", items);
  if (!items || items.length === 0) {
    throw new Error("No items provided in parameters");
  }
  console.log(items);
  // m.call(DzonApp, "list", [ID,NAME, CATEGORY, IMAGE, COST, RATING, STOCK]);


  m.call(DzonApp, "list",
    [
      items[0].id,
      items[0].name,
      items[0].category,
      items[0].image,
      ethers.parseUnits(items[0].price, "wei"),
      items[0].rating,
      items[0].stock,
    ]
  )

  return { DzonApp };
});

