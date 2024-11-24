import { CiSliderHorizontal } from "react-icons/ci";
import { MdStars } from "react-icons/md";
import {Link} from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import {toggleFilter} from '../utils/restaurantSlice';
import { BUCKET_PATH } from "../utils/constants";


export const RestaurantCard = ({prop}) => {
    const res = prop
    return (
        <div key={res?.id} className="w-72 h-80 flex-col p-0 mr-2 my-4 shadow-lg rounded-md transition-transform transform hover:bg-slate-200 duration-300 ease-in-out">
            <img src={BUCKET_PATH + res?.cloudimageid + ".avif"}  className="w-72 h-44 object-cover rounded-xl" alt="res_image" />
            <div className="px-2">
                <h4 className="absolute left-2 top-36 text-white font-extrabold text-base max-w-[80%] w-[80%] max-h-5 overflow-hidden">{res?.offers}</h4>
                <p className='overflow-hidden font-semibold py-1'>{res?.name}</p>
                <p className="overflow-hidden rating-time font-medium"> <MdStars className='text-green-900 text-2xl pb-1 inline-block' /> {res?.rating} • {res?.deliverytime} mins</p>
                <p className="overflow-hidden cuisines font-normal text-sm text-gray-500">{res?.cuisine}</p>
                <p className="overflow-hidden locality font-normal text-sm text-gray-500"> {res?.locality}</p>
            </div>  
        </div>
    )
}


export const TopRated = (RestaurantCard) =>{
    return ({prop}) => {
        return (
            <div>
                <label className="absolute z-10 text-white text-sm bg-black rounded-lg p-1 ">Top Rated</label>
                <RestaurantCard prop = {prop}/>
            </div>
        )
    }   
}


const  TopRatedRestaurantCard  = TopRated(RestaurantCard)

const Restaurants = () => {
    
    const dispatch = useDispatch()
    const filteredData = useSelector((store)=>(store.restaurants.filteredRestaurantsList))

    const activeFilters = useSelector((store) => store.restaurants.activeFilters);

    const getButtonClass = (filterName) => {
        return activeFilters[filterName] ? 'btn-active' : 'btn';
    };

    return (
        <div className='restaurants-ctr'>
            <h3 className="font-bold text-xl py-7">Restaurants with online food delivery in Bangalore</h3>
            <div className='flex justify-start py-7 flex-wrap gap-2'>
                <button className='btn'>Filter <CiSliderHorizontal className="text-l m-2" /></button>
                <button className={getButtonClass('fastDelivery')} onClick={() => dispatch(toggleFilter('fastDelivery'))}> Fast Delivery </button>
                <button className={getButtonClass('new')} onClick={() => dispatch(toggleFilter('new'))}> New </button>
                <button className={getButtonClass('rating4Plus')} onClick={() => dispatch(toggleFilter('rating4Plus'))}>Ratings 4.0+</button>
                <button className={getButtonClass('pureVeg')} onClick={() => dispatch(toggleFilter('pureVeg'))}> Pure Veg </button>
                <button className={getButtonClass('offers')} onClick={() => dispatch(toggleFilter('offers'))}> Offers </button>
                <button className={getButtonClass('priceRange300To600')} onClick={() => dispatch(toggleFilter('priceRange300To600'))}> Rs. 300-Rs. 600 </button>
                <button className={getButtonClass('priceRangelessThan300')} onClick={() => dispatch(toggleFilter('priceRangelessThan300'))}> Less than Rs. 300 </button>
            </div>
            <div className='restaurants-card-ctr flex flex-wrap'>
                {
                    filteredData ? filteredData.map((data) => {
                            return (
                                <Link to={"/menu/" + data?.cloudimageid} state={{ data: data }} key={data.id}> 
                                    <div>
                                        {data?.rating > 4.5 ?  <TopRatedRestaurantCard key={data?.id} prop={data} /> : <RestaurantCard key={data?.id} prop={data} />}
                                    </div>
                                </Link>
                                )
                    }) : null
                }
            </div>
        </div>
    )
}

export default Restaurants;