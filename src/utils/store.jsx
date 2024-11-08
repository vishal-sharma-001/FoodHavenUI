    import { configureStore } from "@reduxjs/toolkit";
    import cartReducer from './cartSlice';
    import restaurantsReducer from "./restaurantSlice";
    
    const store = configureStore({
        reducer:{
            cart: cartReducer,
            restaurants: restaurantsReducer
        }
    });

    export default store;