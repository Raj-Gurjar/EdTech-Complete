import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const getTotalItems = localStorage.getItem("CartTotalItems");
const getCart = localStorage.getItem("cart");
const getTotalAmount = localStorage.getItem("CartTotalAmount");

interface CartState {
  cart: any[];
  totalItems: number;
  totalAmount: number;
}

const cartInitialState: CartState = {
  cart: getCart ? JSON.parse(getCart) : [],
  totalItems: getTotalItems ? JSON.parse(getTotalItems) : 0,
  totalAmount: getTotalAmount ? JSON.parse(getTotalAmount) : 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: cartInitialState,
  reducers: {
    addToCart: (state, action) => {
      const course = action.payload;
      const index = state.cart.findIndex((item: any) => item._id === course._id);

      if (index >= 0) {
        toast.error("This Course is already in the Cart");
        return;
      }
      state.cart.push(course);
      state.totalItems++;
      state.totalAmount += course.price;

      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("totalItem", JSON.stringify(state.totalItems));
      localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount));

      toast.success("Course Added to Cart");
    },

    removeFromCart: (state, action) => {
      console.log("in remove");
      const courseId = action.payload;
      const index = state.cart.findIndex((item: any) => item._id === courseId);

      console.log("ind", state.cart[index]);
      if (index >= 0) {
        state.totalItems--;
        state.totalAmount -= state.cart[index].price;
        state.cart.splice(index, 1);

        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("totalItem", JSON.stringify(state.totalItems));
        localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount));

        toast.success("Course Removed Successfully");
      }
    },
    setTotalItems(state, action) {
      state.totalItems = action.payload;
    },
    //! add a func to reset cart
    resetCart: (state) => {
      console.log("resetCart Called");
      state.cart = [];
      state.totalItems = 0;
      state.totalAmount = 0;

      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("totalItem", JSON.stringify(state.totalItems));
      localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  setTotalItems,
  resetCart,
} = cartSlice.actions;
export default cartSlice.reducer;

