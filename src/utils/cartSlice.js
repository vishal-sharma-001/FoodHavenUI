import { createSlice } from "@reduxjs/toolkit";

const cartSlice =  createSlice({
    name: 'cart',
    initialState: {
        // intital state of our slice
        items: []
    },
    reducers: {
        // reducer functions corresponding to our actions - like add an item, delete an item, clear cart
        // these keys in the object addItem, deleteItem, clearCart are actions and their values(the callback functions) are their reducers
        addItem : (state, action) => {
            state.items.push(action.payload);
        },

        deleteItem: (state, action) => {
            state.items.splice(state.items.indexOf(action.payload), 1);
        },

        clearCart: (state) => {
            state.items.length = 0;
        }
    }
})

//export actions
export const {addItem, deleteItem, clearCart} =  cartSlice.actions;

//export reducer
export default cartSlice.reducer;