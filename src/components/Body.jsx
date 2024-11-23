import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";
import useOnlineStatus from '../utils/useOnlineStatus';
import Restaurants from "./Restaurants";
import { useSelector } from "react-redux";
import { useRef } from 'react';
import {Link} from 'react-router-dom';
import { useDispatch } from "react-redux";
import { BUCKET_PATH } from "../utils/constants";

const Body =() =>{
    const onlinestatus = useOnlineStatus()
    const offers = useSelector((store)=> (store.restaurants.offers))

    if(!onlinestatus)
        return <div> Your Intenet is not working properly.</div>

    return(
        <div className='p-10'>
            { !offers &&
                <div>
                    <FoodSuggestions />
                    <hr id="rule"></hr>
                </div>
            }
            <Restaurants />
        </div>
    )
}

export default Body;

export const FoodSuggestions = () => {
    const dispatch = useDispatch()
    const scrollRef = useRef(null);
    const scrollAmount = window.innerWidth * 0.7;

    const scrollLeft = () => scrollRef.current?.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    const scrollRight = () => scrollRef.current?.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    const res = useSelector((store)=>(store.restaurants.restaurantsList))
    const shuffledRes = res && [...res].sort(() => Math.random() - 0.5);

    return (
        <div>
            <h3 className='font-bold text-xl'>What's on your mind?</h3>
            <div className='flex justify-end mr-20 text-gray-400 text-2xl'>
                <FaArrowCircleLeft className='carousal-controls-btn mr-3 hover:text-slate-200' onClick={scrollLeft} />
                <FaArrowCircleRight className='carousal-controls-btn hover:text-slate-200' onClick={scrollRight} />
            </div>
            <div ref={scrollRef} className='carousal-ctr flex overflow-x-hidden hide-scrollbar' >
                {
                    shuffledRes && shuffledRes.map((data, idx) => (
                        <Link to={"/menu/" + data?.cloudimageid} state={{ data: data }} key={data.id}> 
                            <img className="w-60 min-w-60 h-52 object-cover m-2 rounded-md transition duration-200 hover:scale-90" src={BUCKET_PATH + data?.cloudimageid + ".avif"}  key={idx} alt="restaurant"/>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}
