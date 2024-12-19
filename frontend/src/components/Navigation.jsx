/* eslint-disable react/prop-types */
import {ethers} from 'ethers';
function Navigation(props) {

    const connectHandler = async ()=>{
        const accounts = await window.ethereum.request({method:'eth_requestAccounts'}); 
        const ac = ethers.getAddress(accounts[0]);   
        props.setAccount(ac);

    }
  return (
    <nav>
      <div className="nav__brand">
        <h1>Dzon</h1>
      </div>

      <input type="text" className="nav__search" />
      {props.account ? (
        <button type="button" className="nav__connect">
          {/* this is how you show not the whole account but the .. one  */}
          {props.account.slice(0, 6) + "..." + props.account.slice(38, 42)}
        </button>
      ) : (
        <button type="button" className="nav__connect" onClick={connectHandler}>
          Connect
        </button>
      )}

      <ul className="nav__links">
        <li>
          <a href="#Clothing & Jewelry">Clothing & Jewelry</a>
        </li>
        <li>
          <a href="#Electronics & Gadgets">Electronics & Gadgets</a>
        </li>
        <li>
          <a href="#Toys & Gaming">Toys & Gaming</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
