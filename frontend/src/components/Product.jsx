/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Rating from "./Rating";
import close from "../assets/img/close.svg";

function Product(props) {

  const [order,setOrder] = useState(null);
  const [hasBought,sethasBought] = useState(false);

//WHY HERE CALLBACK IS USED AND WHY USEEFFECT IS USED DOWN READ 7TH FROM ABOUT
  const fetchDetails =useCallback( async()=>{
    // event/emits from sc : This fetches all blockchain events called Buy from the Dappazon smart contract.
    const events = await props.dApp.queryFilter("Buy");
    /*
    From all the Buy events, it keeps only the ones where:
    The buyer is the same as the current user (account).
    The itemId matches the item being checked (item.id).
    If no relevant events are found, it means the user hasn’t bought this item. 
     */
    const orders = events.filter(
      (event) => event.args.buyer === props.account && event.args.itemId.toString() === props.item.id.toString()
    )
    //If no matching events were found, the function stops here.
    if (orders.length === 0) return;

    const order = await props.dApp.orders(props.account, orders[0].args.orderId)
    setOrder(order);
    
  },[props.dApp,props.account,props.item.id])
  //function to buy that interacts with the blockchain
  //Remember one thing the way we do test for SmartContract same way we call the functions here just a little name difference
  const buyHandler = async () => {
    //note here we cannot use provider we will use signer as we will change/modify or add to the bc using SmartContract 
    //Read about.txt
    /*
    The signer is derived from the provider and represents an account (with a private key) that can sign transactions.
    In most cases, you use the same provider to create the signer. The signer will be tied to one of the accounts provided by the provider (e.g., the account from MetaMask).
    */
    const signer = await props.provider.getSigner();
    let transactions = props.dApp.connect(signer).buyProduct(props.item.id,{value:props.item.cost})
    await transactions.wait();
    //like we want to let the user know that he has bought this product when before if he has
    sethasBought(true);
  };
  useEffect(()=>{
    fetchDetails();
  },[fetchDetails,hasBought])

  return (
    <div className="product">
      <div className="product__details">
        <div className="product__image">
          <img src={props.item.image} alt="Product" />
        </div>
        <div className="product__overview">
          <Rating value={props.item.rating} />
          <hr />
          <p>{props.item.address}</p>
          <h2>{ethers.formatUnits(props.item.cost, "ether")} ETH</h2>
          <hr />
          <h2>Overview</h2>
          <p>
            {props.item.description}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima rem,
            iusto, consectetur inventore quod soluta quos qui assumenda aperiam,
            eveniet doloribus commodi error modi eaque! Iure repudiandae
            temporibus ex? Optio!
          </p>
        </div>

        <div className="product__order">
          <h1>{ethers.formatUnits(props.item.cost, "ether")} ETH</h1>
          <p>
            FREE delivery <br />
            <strong>
              {new Date(Date.now() + 345600000).toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </strong>
          </p>
          {/* checking if the item is available or not */}
          {props.item.stock > 0 ? <p>In Stock.</p> : <p>Out of Stock.</p>}

          <button className="product__buy" onClick={buyHandler}>
            Buy Now
          </button>
          <p>
            <small>Ships from</small> Dzon
          </p>
          <p>
            <small>Sold by</small> Dzon
          </p>
          {order && (
            <div className='product__bought'>
              Item bought on <br />
              <strong>
                {new Date(Number(order.time.toString() + '000')).toLocaleDateString(
                  undefined,
                  {
                    weekday: 'long',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                  })}
              </strong>
            </div>
          )}
        </div>
        <button onClick={props.togglePop} className="product__close">
          <img src={close} alt="Close" />
        </button>
      </div>
    </div>
  );
}

export default Product;
