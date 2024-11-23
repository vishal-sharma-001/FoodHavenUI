import { useEffect, useState} from 'react'
import { FOODHAVEN_API } from './constants';

const useResturantMenu = (prop) =>{
    const [resInfo, setResInfo] = useState(null)

    useEffect(()=>{
        
        fetch(`${FOODHAVEN_API}/public/fooditems?cloudimageid=${prop}`)
        .then((resp)=>{
            if(!resp.ok)
                return new Error("Failed to fetch data"+ resp.statusText)
            else
                return resp.json()
        })
        .then((res)=>{
            setResInfo(res?.data)
        })
        .catch((err)=>{
            console.error("Fetching data failed. " + err)
        })
    },[])

    return resInfo
}

export default useResturantMenu;