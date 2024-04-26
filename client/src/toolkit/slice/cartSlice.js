import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const getTotalItems = localStorage.getItem("CartTotalItems");
const getCart = localStorage.getItem("cart");
const getTotalAmount = localStorage.getItem("CartTotalAmount");

const cartInitialState = {
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
      const index = state.cart.findIndex((item) => item._id === course._id);

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
      const courseId = action.payload;
      const index = state.cart.findIndex((item) => item._id === courseId);

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
    setTotalItems(state, value) {
      state.token = value.payload;
    },
    //! add a func to reset cart
    resetCart: (state, action) => {
      console.log("resetCart Called");
      const courseId = action.payload;
      const index = state.cart.findIndex((item) => item._id === courseId);

      if (index >= 0) {
        state.cart = [];
        state.totalItems = 0;
        state.totalAmount = 0;

        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("totalItem", JSON.stringify(state.totalItems));
        localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount));

        toast.success("All items Removed");
      }
    },
  },
});

export const { addToCart, removeFromCart,setTotalItems, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
