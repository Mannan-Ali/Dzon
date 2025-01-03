import "./App.css";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

//components
import Navigation from "./components/Navigation";
//Note this is the general area for different product
import Section from "./components/Section";
//now when user clicks on a product thats what in here
import Product from "./components/Product";

//utils
import abi from "./utils/abi.json";
import config from "./utils/config.json";
function App() {
  //retriving metamask acc
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [dApp, setdApp] = useState(null);

  const [elec, setelec] = useState(null);
  const [cloth, setcloth] = useState(null);
  const [toys, settoys] = useState(null);

  //this whole part is for what haapens when you click a product in a section
  //that will take you to more defined page of the product where you can see about the product

  const [item, setitem] = useState(null);
  //if true go to the product page
  const [toggle, setToggle] = useState(false);

  const togglePop = (item) => {
    // this item is the single product from the section.jsx part
    setitem(item);
    //if we are on the page then go back and if are not then go on the page
    toggle ? setToggle(false) : setToggle(true);
  };
  //now we will use ether js in here to convert the fronntend to blockchain application
  //in navbar we only have coonected the metamask that is making the browser for our frontend compatibale wiht bc
  const loadBcData = async () => {
    //connect to BC
    //now here what we are doing is
    /*
      1.window.ehtereum : Here it literally means yours current webpage(windows) wallet(ethereum).
      It lets your app access the blockchain through the wallet and interact with the user's Ethereum account.

      2.ethers.BrowserProvider
      This is a class from the ethers.js library.
      It wraps the window.ethereum object to give your app an easy way to:
      Send transactions.
      Read blockchain data (e.g., account balance, smart contract data).
      Listen for blockchain events.
      Think of it as a translator between your app and the blockchain.
     */
    /*
    Read about file
    THERE ARE 2 HERE LIKE THIS ONE IS PROVIDER AND THE OTHER IS SIGNER
    */
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);

    //fetching our etherem network in our case localhost we are using in other terminal
    const network = await provider.getNetwork();
    //this gets you what network u are using here as localhost for npx harhatnode so undefined and aslo you can see the chain id of hardhat
    console.log(network);

    //connecting to our smartContract
    //to do this we need 3 thing
    // 1.addrees of smartContract - we get it when we deploy or run the ignigtion file save it somewhere
    // here we have stored that stuff in config file
    //now we can direclty use 31337 the number but we do it like a check if the network is hardaht then the network.chainId will return 31337 so its work dynamically as check also 
    //2. abi -> we can get it in articats/contracts//Dzon.sol/Dzon.json'
    //easy way is to copy the abi from there to another json file and use that here.
    /*
    the default chain ID for the Hardhat Network is still 31337 as of today
    3.network.chainId = 31337 so we are using dynamically from above network here 
    provider or signer (The third parameter):

    This parameter determines how you will interact with the contract.
    provider: A provider allows you to read data from the blockchain, such as calling view or pure functions. It doesn't send any transactions.

    Example: const provider = new ethers.BrowserProvider(window.ethereum); — Here, the provider connects to MetaMask to read data.
    signer: A signer is used if you need to send transactions (such as modifying contract state by calling non-view functions like setOwner). A signer is essentially an account that can sign transactions.

    Example: const signer = provider.getSigner(); — Here, the signer connects to the MetaMask account and allows the user to send transactions.
    Which to Use:
    If you just need to read data (like fetching a value from a contract), pass a provider.
    If you need to send transactions (like calling functions that modify the contract state), pass a signer.
    */
    //Remember one thing the way we do test for SmartContract same way we call the functions here just a little name difference
    const dApp = new ethers.Contract(
      config[network.chainId].Dzon.address,
      abi,
      provider
    );
    setdApp(dApp);

    //load products
    //already listed product
    const items = [];
    for (var i = 0; i < 9; i++) {
      const item = await dApp.items(i + 1); //1 to 9
      items.push(item);
    }
    console.log(items);

    const electronics = items.filter((item) => {
      return item.category === "electronics";
    });
    const clothing = items.filter((item) => {
      return item.category === "clothing";
    });
    const toys = items.filter((item) => {
      return item.category === "toys";
    });
    setelec(electronics);
    setcloth(clothing);
    settoys(toys);
  };
  useEffect(() => {
    loadBcData();
  }, []);
  return (
    <>
      <Navigation account={account} setAccount={setAccount} />
      <h2>Dzon&apos;s Best Seller</h2>
      {elec && cloth && toys && (
        <div>
          <Section
            title={"Clothing & Jewelry"}
            items={cloth}
            togglePop={togglePop}
          />
          <Section
            title={"Electronics & Gadgets"}
            items={elec}
            togglePop={togglePop}
          />
          <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop} />
        </div>
      )}
      {/* if toggle is not true go back up */}
      {toggle && 
      (<Product item ={item} provider ={provider} account = {account} dApp ={dApp} togglePop={togglePop}/>)
      }
    </>
  );
}

export default App;
