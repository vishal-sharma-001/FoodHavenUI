import React from 'react';
import Header from './components/Header';
import { useEffect} from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addRestaurants, addFilteredRestaurants, setSelectedCity, setCities} from './utils/restaurantSlice';

const App = () => {
    const dispatch = useDispatch()
    const selectedCity = useSelector((store)=> (store.restaurants.selectedCity))
    useEffect(() => {
        fetch("http://localhost:8080/cities")
            .then((res) => {
                if (res.ok)
                    return res.json()
                else
                    throw new Error("Network response was not ok " + res.statusText);
            })
            .then((cities) => {
                dispatch(setCities(cities?.data))
                dispatch(setSelectedCity(cities?.data[0]))
            })
            .catch((err) => {
                console.log("Fetching data failed. " + err)
            })
    }, [])

    useEffect(()=>{
        fetch(`http://localhost:8080/restaurants?city=${selectedCity}`)
            .then((res) => {
                if (res.ok)
                    return res.json()
                else
                    throw new Error("Network response was not ok " + res.statusText);
            })
            .then((res) => {
                dispatch(addRestaurants(res?.data))
                dispatch(addFilteredRestaurants(res?.data))
            })
            .catch((err) => {
                console.log("Fetching data failed. " + err)
            })
    },[selectedCity])
    
    return(
        <div className="min-w-[1800px] min-h-[1000px] overflow-hidden pt-[80px]">
            <Header />
            {/* TO HAVE HEADER ALWAYS ON TOP REGARDLESS OF THE PAGE WE CAN CONDITIONALLY RENDER THE CHILD COMPONENTS */}
                <Outlet />
        </div>
   )
}
export default App;