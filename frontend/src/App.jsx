import "./App.css";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

//components
import Navigation from "./components/Navigation";
import Rating from "./components/Rating";
import Product from "./components/Product";
import Section from "./components/Section";

//utils
import abi from "./utils/abi.json";
import config from "./utils/config.json";
function App() {
  //retriving metamask acc
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [dApp, setdApp] = useState(null);
  const [wc, setwc] = useState(null);
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
    Read about
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
    //2. abi -> we can get it in articats/contracts//Dzon.sol/Dzon.json'
    //easy way is to copy the abi from there to another json file and use that here.
    /*
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
    const dApp = new ethers.Contract(
      config[network.chainId].Dzon.address,
      abi,
      provider
    );
    setdApp(dApp);

    //load products
    const items = [];
    const item = await dApp.items(1);
    items.push(item);
    console.log(items);

    const ele = item.category;
    setwc(ele);
    console.log(ele);
    
  };
  useEffect(() => {
    loadBcData();
  }, []);
  return (
    <>
      <Navigation account={account} setAccount={setAccount} />
      <h2>Dzon&apos;s Best Seller</h2>

      {wc}
      <Rating />
      <Product />
      <Section />
    </>
  );
}

export default App;
