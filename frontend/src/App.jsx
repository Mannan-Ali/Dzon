import './App.css'
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import Navigation from './components/Navigation';
import Rating from './components/Rating';
import Product from './components/Product';
import Section from './components/Section';


function App() {
  //retriving metamask acc
  const [account,setAccount] = useState(null);
  return (
    <>
    <Navigation account={account} setAccount={setAccount}/>
    <Rating/>
    <Product/>
    <Section/>
    </>
  )
}

export default App
