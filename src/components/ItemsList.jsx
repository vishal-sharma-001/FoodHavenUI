import { useDispatch, useSelector } from "react-redux"
import { FaMinus, FaPlus } from "react-icons/fa6";
import { addItem, deleteItem } from "../utils/cartSlice"

const ItemsList = ({prop}) => {
    
    const dispatch = useDispatch()
    
    const addToCart = () => {
        //dispatch an action
        dispatch(addItem(prop?.info?.name))
    }

    const removeFromCart = () => {
        //dispatch an action
        dispatch(deleteItem(prop?.info?.name))
    }
    
    const cartItems = useSelector((store)=> (store.cart.items))

    return (
        <>
            <div className="flex justify-between p-3">
                <div className="text-left p-1 max-w-xl">
                    <p className="font-medium">{prop?.info?.name }</p>
                    <p className="font-medium">{prop?.info?.price ? prop?.info?.price/100 : prop?.info?.defaultPrice/100}</p>
                    <p className="text-zinc-600 mt-10">{prop?.info?.description}</p>
                </div>
                <div>
                    <img className= "rounded-md w-[150px] h-[150px]"src={"https://media-assets.swiggy.com/swiggy/image/upload/" + prop.info.imageId}/>
                    <button className="bg-white text-green-900 rounded-xl border-2 w-24 h-10 relative bottom-6">
                    {   cartItems.filter(item => item === prop?.info?.name).length > 0 ?
                        <div className="p-2 flex justify-between text-green-900"> <FaMinus onClick={removeFromCart} className="pr-1"/> <p> {cartItems.filter(item => item === prop?.info?.name).length} </p> <FaPlus onClick={addToCart}/> </div> : 
                        <p onClick={addToCart}> ADD </p>
                    }
                    </button>
                    <p className="font-light text-xs relative bottom-5 text-gray-500">Customiseable</p>
                </div>
            </div>
            <hr/>       
        </>

    )
}


export default ItemsList;