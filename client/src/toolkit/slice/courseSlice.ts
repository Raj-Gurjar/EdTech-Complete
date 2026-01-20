import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Course {
  _id: string;
  courseName: string;
  courseDescription: string;
  [key: string]: any;
}

interface CourseState {
  step: number;
  course: Course | null;
  editCourse: boolean;
  paymentLoading: boolean;
}

const initialState: CourseState = {
  step: 1,
  course: null,
  editCourse: false,
  paymentLoading: false,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    setCourse: (state, action: PayloadAction<Course | null>) => {
      state.course = action.payload;
    },
    setEditCourse: (state, action: PayloadAction<boolean>) => {
      state.editCourse = action.payload;
    },
    setPaymentLoading: (state, action: PayloadAction<boolean>) => {
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


