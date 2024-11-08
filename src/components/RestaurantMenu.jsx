import { useParams} from 'react-router-dom'
import useRestaurantMenu from '../utils/useRestaurantMenu'
import { IoMdArrowDropdown } from "react-icons/io";
import {useState} from 'react'
import ItemsList from './ItemsList';


const RestaurantMenu = () => {
    const [showIndex, setShowIndex] = useState(null)
    const param = useParams()
    const data = useRestaurantMenu(param.resid)  //custom hook

    if (data == null)
        return <></>
    
    const menu = data[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards.filter((category) => {return category.card.card["@type"] == "type.googleapis.com/swiggy.presentation.food.v2.ItemCategory"})
    return (
        <div className="menu-ctr mx-auto w-6/12 text-center">
            <h2 className="text-3xl font-extrabold">{data[2]?.card?.card.info.name}</h2>
            {menu && menu.map((categ, idx) =>(                        
                <RestaurantCategory key={idx} prop={categ} showItems={idx === showIndex ? true : false}  setShowIndex={() => idx === showIndex ? setShowIndex(null) :setShowIndex(idx)}/>
            ))}
        </div>
    );
}

export const RestaurantCategory = ({prop, showItems, setShowIndex}) => {
    const handleListView = () => {
        setShowIndex()
    }
    return(
        <div >
            <div className="border-solid border-2 shadow-lg my-4 p-3 flex justify-between">
                <span className="font-medium text-lg">{prop.card?.card?.title + "(" + prop.card?.card?.itemCards.length + ")"}</span> <span className="text-xl font-semibold mt-2" onClick={handleListView}> <IoMdArrowDropdown /> </span>
            </div>
            {prop.card?.card?.itemCards?.map((menuItem, idx) => (
                    showItems ? <ItemsList key={idx} prop={menuItem?.card}/>  : <></>
                ))
            }
        </div>
    )
}

export default RestaurantMenu;