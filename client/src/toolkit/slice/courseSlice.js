import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  course: null,
  editCourse: false,
  paymentLoading: false,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
      console.log("step: ", state.step);
    },
    setCourse: (state, action) => {
      state.course = action.payload;
      console.log("course state", state.course);
    },
    setEditCourse: (state, action) => {
      state.editCourse = action.payload;
    },
    setPaymentLoading: (state, action) => {
      state.paymentLoading = action.payload;
    },
    resetCourseState: (state) => {
      state.step = 1;
      state.course = null;
      state.editCourse = false;
    },
  },
});

export const {
  setStep,
  setPaymentLoading,
  setEditCourse,
  setCourse,
  resetCourseState,
} = courseSlice.actions;
export default courseSlice.reducer;
