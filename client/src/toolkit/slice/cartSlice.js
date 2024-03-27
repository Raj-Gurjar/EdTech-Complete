import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const getTotalItems = localStorage.getItem("totalItems");
const cartInitialState = {
  totalItems: getTotalItems ? JSON.parse(getTotalItems) : 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: cartInitialState,
  reducers: {
    setTotalItems(state, value) {
      state.token = value.payload;
    },
    //! add a func to add to cart
    //! add a func to remove to cart
    //! add a func to reset cart
    resetCart() {
      console.log("resetCart Called");
    },
  },
});

export const { setTotalItems,resetCart } = cartSlice.actions;
export default cartSlice.reducer;
