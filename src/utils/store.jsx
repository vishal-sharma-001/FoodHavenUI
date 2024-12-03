import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import restaurantsReducer from "./restaurantSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    restaurants: restaurantsReducer,
    user: userReducer,
  },
});

export default store;
