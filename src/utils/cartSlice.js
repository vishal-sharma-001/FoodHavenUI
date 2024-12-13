import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart_id: null,
    items: [],
    clearCartModal: false,
  },
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
    },
    deleteItem: (state, action) => {
      const itemIndex = state.items.findIndex(
        (item) => item.id === action.payload
      );
      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items.splice(itemIndex, 1);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    showClearCartModal: (state, action) => {
      state.clearCartModal = action.payload;
    },
    setCartId:(state, action) => {
      state.cart_id = action.payload;
    },
    setItems: (state, action) => {
      state.items = action.payload
    },  
  },
});

export const { addItem, deleteItem, clearCart, showClearCartModal, setCartId, setItems } =
  cartSlice.actions;
export default cartSlice.reducer;
