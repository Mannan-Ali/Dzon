/* eslint-disable react/prop-types */
import star_regular from '../assets/img/star-regular.svg';
import star_solid from '../assets/img/star-solid.svg';
function Rating(props) {
    return (
        <div className='rating'>
        <img src={props.value >= 1 ? star_solid : star_regular} width="20px" height="20px" alt="Star" />
        <img src={props.value >= 2 ? star_solid : star_regular} width="20px" height="20px" alt="Star" />
        <img src={props.value >= 3 ? star_solid : star_regular} width="20px" height="20px" alt="Star" />
        <img src={props.value >= 4 ? star_solid : star_regular} width="20px" height="20px" alt="Star" />
        <img src={props.value >= 5 ? star_solid : star_regular} width="20px" height="20px" alt="Star" />
    </div>
    )   
}

export default Rating;