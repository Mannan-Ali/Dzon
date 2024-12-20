/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Rating from "./Rating";
import close from "../assets/img/close.svg";

function Product(props) {
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
        </div>
      </div>
    </div>
  );
}

export default Product;
