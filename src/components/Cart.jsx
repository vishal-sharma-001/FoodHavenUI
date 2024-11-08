import {useSelector, useDispatch} from 'react-redux'

const Cart = () => {
    const itemsList = useSelector((store)=>store.cart.items)

    return(
        <div className="p-20">
            { itemsList && itemsList.map((item) => <div className="m-10">{item}</div>)
            }
        </div>
    )
}

export default Cart;