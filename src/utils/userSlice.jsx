import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "userslice",
  initialState: {
    authUser: null,
    addresses: [],
    selectedAddress: null,
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
    },
    addAddress: (state, action) => {
      state.addresses.push(action.payload);
    },
    editAddress: (state, action) => {
      const { id, updatedAddress } = action.payload;
      const index = state.addresses.findIndex((address) => address.id === id);
      if (index !== -1) {
        state.addresses[index] = updatedAddress;
      }
    },
    selectAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
    setAddresses: (state, action) => {
      state.addresses = action.payload;
    },
    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(
        (address) => address.id !== action.payload
      );
    },
  },
});

export const {
  setAddresses,
  setAuthUser,
  addAddress,
  editAddress,
  selectAddress,
  deleteAddress,
  editAuthUser,
} = userSlice.actions;
export default userSlice.reducer;
