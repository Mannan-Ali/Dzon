/* eslint-disable react/prop-types */
import Rating from './Rating'
import { ethers } from "ethers";
//this section means for different category of products
function Section(props) {
  return (
    <div className="cards__section">
      <h3 id={props.title}>{props.title}</h3>
      <hr />
      <div className="cards">
        {props.items.map((item, index) => {
          return (
            <div key={index} className="card" onClick={()=>{ props.togglePop(item)}}>
              <div className="card__image">
                <img src={item.image} alt="Item" />
              </div>
              <div className="card__info">
                <h4>{item.name}</h4>
                <Rating value={item.rating}/>
                {/*In Ethereum, values like Ether are often represented in Wei (the smallest unit of Ether). For example, 1 ETH = 10^18 Wei.
                 To make the numbers readable for humans, the ethers.formatUnits function is used to format these values into more conventional units like Ether   */}
                <p>{ethers.formatUnits(item.cost, 'ether')} ETH</p>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Section;
