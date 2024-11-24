import { useParams, useLocation } from 'react-router-dom';
import useRestaurantMenu from '../utils/useRestaurantMenu'
import { IoMdArrowDropdown } from "react-icons/io";
import {useState, useEffect} from 'react'
import ItemsList from './ItemsList';
import { useDispatch, useSelector } from 'react-redux';
import { showClearCartModal, clearCart} from '../utils/cartSlice';
import { setSelectedRes } from '../utils/restaurantSlice';


const RestaurantMenu = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const [showIndex, setShowIndex] = useState(0)
    const param = useParams()
    const data = useRestaurantMenu(param?.resid)
    const location = useLocation();
    const restaurant = location.state.data
    const dispatch = useDispatch()
    const clearCartModal = useSelector((store)=> store.cart.clearCartModal)

    const handleClearCardClick = () => {
        dispatch(showClearCartModal(false))
        dispatch(clearCart())
        dispatch(setSelectedRes(null))
    }

    if (data == null || restaurant == null)
        return <></>

    return (
        <div className="menu-ctr mx-auto md:w-6/12 text-center m-5">
            <h2 className="text-3xl font-extrabold">{restaurant?.name}</h2>
            {
                Object.keys(data).map((category, idx) => (
                    <RestaurantCategory
                        key={idx}
                        category={category}
                        data={data[category]}
                        restaurant={restaurant}
                        showItems={idx === showIndex}
                        setShowIndex={() => idx === showIndex ? setShowIndex(null) : setShowIndex(idx)}
                    />
                ))
            }
            {
                clearCartModal && 
                <div className='fixed w-full h-full bg-black bg-opacity-40 flex justify-center items-center z-50 top-0 left-0'>
                    <div className='bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center'>
                        <h3 className='text-lg font-bold mb-2'>Items already in cart</h3>
                        <p className='text-sm text-gray-600 mb-6'>
                            Your cart contains items from another restaurant. Would you like to reset your cart to add items from this restaurant?
                        </p>
                        <div className='flex justify-around'>
                            <button className='border border-black text-black py-2 px-4 rounded-md font-semibold hover:bg-neutral-200' onClick={()=>dispatch(showClearCartModal(false))}>
                                NO
                            </button>
                            <button className='bg-black text-white py-2 px-4 rounded-md font-semibold hover:bg-neutral-800' onClick={()=>handleClearCardClick()}>
                                YES, CLEAR CART
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
        
    );
}

export const RestaurantCategory = ({category, data, restaurant, showItems, setShowIndex}) => {
    const handleListView = () => {
        setShowIndex()
    }

    return(
        <div >
            <div className="border-solid border-2 shadow-lg my-4 p-3 flex justify-between cursor-pointer" onClick={handleListView}>
                <span className="font-medium text-lg">{category + "(" + data?.length + ")"}</span> <span className="text-xl font-semibold mt-2" > <IoMdArrowDropdown /> </span>
            </div>
            {data?.map((menuItem, idx) => {
                    menuItem["restaurantId"] = restaurant.id
                    return showItems && <ItemsList key={idx} prop={menuItem}/>
                })
            }
        </div>
    )
}

export default RestaurantMenu;