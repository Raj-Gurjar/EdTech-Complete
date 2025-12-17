import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CourseSection {
  _id: string;
  sectionName: string;
  subSection: any[];
  [key: string]: any;
}

interface Course {
  _id: string;
  courseName: string;
  courseDescription: string;
  [key: string]: any;
}

interface ViewCourseState {
  courseSectionData: CourseSection[];
  courseEntireData: Course | null;
  completedLectures: string[];
  totalNoOfLectures: number;
}

const initialState: ViewCourseState = {
  courseSectionData: [],
  courseEntireData: null,
  completedLectures: [],
  totalNoOfLectures: 0,
};

const viewCourseSlice = createSlice({
  name: "viewCourse",
  initialState,
  reducers: {
    setCourseSectionData: (state, action: PayloadAction<CourseSection[]>) => {
      state.courseSectionData = action.payload;
    },
    setEntireCourseData: (state, action: PayloadAction<Course | null>) => {
      state.courseEntireData = action.payload;
    },
    setTotalNoOfLectures: (state, action: PayloadAction<number>) => {
      state.totalNoOfLectures = action.payload;
    },
    setCompletedLecture: (state, action: PayloadAction<string[]>) => {
      state.completedLectures = action.payload;
    },
    updateCompletedLectures: (state, action: PayloadAction<string>) => {
      state.completedLectures = [...state.completedLectures, action.payload];
    },
  },
});

export const {
  setCourseSectionData,
  setTotalNoOfLectures,
  updateCompletedLectures,
  setEntireCourseData,
  setCompletedLecture,
} = viewCourseSlice.actions;

export default viewCourseSlice.reducer;


