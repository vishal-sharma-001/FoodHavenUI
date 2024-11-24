import React from 'react';
import Header from './components/Header';
import { useEffect} from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addRestaurants, addFilteredRestaurants, setSelectedCity, setCities} from './utils/restaurantSlice';
import { FOODHAVEN_API } from './utils/constants';
import { setAuthUser, setAddresses } from './utils/userSlice';

const App = () => {
    const dispatch = useDispatch()
    const selectedCity = useSelector((store)=> (store.restaurants.selectedCity))
    const authUser = useSelector((store) => store.user.authUser)
    
    useEffect(() => {
        fetch(`${FOODHAVEN_API}/public/cities`)
            .then((res) => {
                if (res.ok)
                    return res.json()
                else
                    throw new Error("Network response was not ok " + res.statusText);
            })
            .then((cities) => {
                if(cities != null){
                    dispatch(setCities(cities?.data))
                    dispatch(setSelectedCity(cities?.data[0]))
                }
            })
            .catch((err) => {
                console.error("Fetching data failed. " + err)
            })


        fetch(`${FOODHAVEN_API}/private/user/getuser`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            })   
        .then((res) => {
            if (res.ok)
                return res.json()
            else
                throw new Error("Network response was not ok " + res.statusText);
        })
        .then((res) => {
            dispatch(setAuthUser(res))
        })
        .catch((err) => {
            console.error("Fetching data failed. " + err)
        })
    
    }, [])

    useEffect(()=>{
        if(authUser != null) 
            fetchUserAddresses()
    }, [authUser])


    useEffect(()=>{
        if(!selectedCity)
            return;

        fetch(`${FOODHAVEN_API}/public/restaurants?city=${selectedCity}`)
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
                console.error("Fetching data failed. " + err)
            })
    },[selectedCity])

    const fetchUserAddresses = async () => {
        try {
            const response = await fetch(`${FOODHAVEN_API}/private/user/getaddresses`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch addresses');
            }
    
            const data = await response.json();
            dispatch(setAddresses(data));
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    return(
        <div className="pt-[200px] md:pt-[80px] select-none">
            <Header />
            <Outlet />
        </div>
   )
}
export default App;