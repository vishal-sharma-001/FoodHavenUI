import { IoLocationOutline } from "react-icons/io5";
import { FaSearch, FaRegUserCircle, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../utils/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { addFilteredRestaurants, setSelectedCity } from "../utils/restaurantSlice";
import Signup from "./Signup";
import { useEffect, useState } from "react";

const Header = () => {
    const authUser = useSelector((store) => store.user.authUser);
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const resData = useSelector((store) => store.restaurants.restaurantsList);
    const selectedCity = useSelector((store) => store.restaurants.selectedCity);
    const cities = useSelector((store) => store.restaurants.cities);
    const cartItems = useSelector((state) => state.cart.items);

    const [searchFilter, setSearchFilter] = useState("");

    useEffect(() => {
        if (searchFilter === "") {
            dispatch(addFilteredRestaurants(resData));
        } else {
            dispatch(
                addFilteredRestaurants(
                    resData.filter((res) =>
                        res.name.toLowerCase().includes(searchFilter.toLowerCase())
                    )
                )
            );
        }
    }, [searchFilter, dispatch, resData]);

    const totalItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const handleUserIconClick = () => {
        console.log(authUser)
        if (authUser) {
            navigate("/userprofile");
        } else {
            setIsSignupOpen(true);
        }
    };

    return (
        <div className="fixed top-0 left-0 w-screen z-50 bg-white flex flex-wrap justify-between items-center gap-x-2 gap-y-5 lg:px-20 xl:px-60 2xl:px-80 py-2 shadow-md md:flex-row flex-col">
            <Link to="/" className="mb-2 md:mb-0">
                <img className="object-cover w-[120px] h-[40px] md:w-[150px] md:h-[50px]" src={Logo} alt="FoodHaven logo" />
            </Link>
            <div className="flex items-center mb-2 md:mb-0">
                <IoLocationOutline className="text-lg md:text-2xl mr-2" />
                <select
                    className="w-32 md:w-40 p-2 border-none outline-none bg-white"
                    value={selectedCity}
                    onChange={(e) => dispatch(setSelectedCity(e.target.value))}
                >
                    {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
            </div>
            <div className="flex items-center md:w-auto mb-2 md:mb-0">
                <FaSearch className="text-lg md:text-xl mr-2" />
                <input
                    type="search"
                    className="flex-grow md:flex-none w-64 h-8 p-2 border border-gray-300 rounded-md outline-none"
                    placeholder="Search..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                />
            </div>
                <FaRegUserCircle onClick={handleUserIconClick} className="text-lg md:text-xl mx-4 hover:cursor-pointer" />
                {isSignupOpen && <Signup isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />}
                <Link to="/cart" className="relative mx-4">
                    <FaShoppingCart className="text-lg md:text-xl" />
                    {totalItemCount > 0 && (
                        <span className="absolute top-0 right-0 text-xs text-white font-bold bg-red-500 px-1 rounded-full">
                            {totalItemCount}
                        </span>
                    )}
                </Link>

        </div>
    );      
};

export default Header;
