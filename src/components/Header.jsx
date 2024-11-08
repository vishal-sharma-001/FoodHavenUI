import { IoLocationOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { BiSolidOffer } from "react-icons/bi";
import { IoIosHelpBuoy } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from 'react-router-dom'
import Logo from '../utils/images/logo.png';
import { useDispatch, useSelector } from "react-redux";
import { addFilteredRestaurants,setSelectedCity } from '../utils/restaurantSlice';

import { useEffect, useState } from 'react'

const Header = () =>{
    const dispatch = useDispatch()
    const resData = useSelector((store) => (store.restaurants.restaurantsList))
    const selectedCity = useSelector((store)=> (store.restaurants.selectedCity))
    const cities = useSelector((store)=> (store.restaurants.cities))


    const [searchFilter, setSearchFilter] = useState("")
    useEffect(() =>{    
        if(searchFilter === "")
            dispatch(addFilteredRestaurants(resData))
        
        else{
            dispatch(addFilteredRestaurants(resData.filter((res)=>{
                return res.name.toLowerCase().includes(searchFilter.toLowerCase())
            })))
        }
    },[searchFilter])

    //subscribng to the our cart Items -> we are explicitly stating that we are only subscribing to a particular part of our store
    
    const cartItems = useSelector((store)=> (store.cart.items))

    return (    
        <div className='pl-48 fixed top-0 left-0 w-full z-50 bg-white flex justify-start items-baseline pb-3 shadow-md min-w-[1800px] overflow-hidden '>
            <div className='mr-20 relative top-2'>
                <Link to="/">
                    <img className='object-cover w-[150px] h-[50px] max-w-full' src={Logo} alt='logo' />
                </Link>
            </div>
            <div className='flex mr-32'>
                <IoLocationOutline  className="text-2xl mr-2" id="location-icon" />
                <select className='location-input w-40 p-2 border-none outline-none bg-white' value={selectedCity} onChange={(e)=> dispatch(setSelectedCity(e.target.value))}>
                    {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
            </div>
            <div className='flex'>
                <label htmlFor='food-search'>
                    <FaSearch  className="text-xl mr-2 mt-1" id="search-icon"/>
                </label>
                <input type='search' className="w-72 h-7 p-2 border-none outline-none" id='food-search' placeholder='Search...' value={searchFilter} onChange={(e)=> setSearchFilter(e.target.value)}/>
            </div>
            <div className='flex ml-28'>
                <div className='icons text-2xl mx-16'>
                    <BiSolidOffer />
                </div>
                <div  className='icons text-2xl mx-16'>
                    <Link to="/help"><IoIosHelpBuoy id ="help" /></Link>
                </div>
                <div  className='icons text-xl mx-16'>
                    <FaRegUserCircle/>
                </div>
                <div  className='icons text-xl mx-16'>
                    <Link to="/cart">
                        <FaShoppingCart />
                        {
                            cartItems && cartItems?.length > 0 ?
                            <span className="absolute right-[190px] top-[35px] text-sm text-white font-bold bg-red-500 px-1 rounded-3xl">{cartItems?.length}</span>
                            : <></>
                        }
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Header;