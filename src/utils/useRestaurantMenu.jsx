import { useEffect, useState} from 'react'
import {restaurantMenuApi} from './constants'

const useResturantMenu = (prop) =>{
    const [resInfo, setResInfo] = useState(null)

    useEffect(()=>{
        
        fetch( restaurantMenuApi + prop +"&catalog_qa=undefined&submitAction=ENTER")
        .then((resp)=>{
            if(!resp.ok)
                return new Error("Failed ot fetch data"+ resp.statusText)
            else
                return resp.json()
        })
        .then((res)=>{
            setResInfo(res?.data?.cards)
        })
        .catch((err)=>{
            console.log("Fetching data failed. " + err)
        })
    },[])

    return resInfo
}

export default useResturantMenu;