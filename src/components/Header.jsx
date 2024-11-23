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
        <div className="fixed top-0 left-0 w-full z-50 bg-white flex justify-center items-baseline pb-3 shadow-md">
            {/* Logo */}
            <div className="mr-20 relative top-2">
                <Link to="/">
                    <img
                        className="object-cover w-[150px] h-[50px]"
                        src={Logo}
                        alt="FoodHaven logo"
                    />
                </Link>
            </div>

            {/* Location Selection */}
            <div className="flex mr-32">
                <IoLocationOutline className="text-2xl mr-2" id="location-icon" />
                <select
                    className="location-input w-40 p-2 border-none outline-none bg-white"
                    value={selectedCity}
                    onChange={(e) => dispatch(setSelectedCity(e.target.value))}
                >
                    {cities.map((city) => (
                        <option key={city} value={city}>
                            {city}
                        </option>
                    ))}
                </select>
            </div>

            {/* Search Bar */}
            <div className="flex">
                <label htmlFor="food-search">
                    <FaSearch className="text-xl mr-2 mt-1" id="search-icon" />
                </label>
                <input
                    type="search"
                    className="w-72 h-7 p-2 border-none outline-none"
                    id="food-search"
                    placeholder="Search..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                />
            </div>

            {/* User and Cart Icons */}
            <div className="flex ml-28 justify-center items-center">
                {/* User Icon */}
                <div className="icons text-xl mx-16">
                    <FaRegUserCircle
                        onClick={handleUserIconClick}
                        className="hover:cursor-pointer"
                    />
                </div>
                {/* Signup Modal */}
                {isSignupOpen && (
                    <Signup isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
                )}

                {/* Cart Icon */}
                <div className="icons text-xl mx-16 flex">
                    <Link to="/cart" className="relative">
                        <FaShoppingCart />
                        {totalItemCount > 0 && (
                            <span className="absolute top-3 left-3 text-sm text-white font-bold bg-red-500 px-1 rounded-full">
                                {totalItemCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Header;
