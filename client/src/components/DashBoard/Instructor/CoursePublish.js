import React from "react";
import { setStep } from "../../../toolkit/slice/courseSlice";
import {useDispatch} from "react-redux";

export default function CoursePublish() {
  const dispatch = useDispatch();
  return (
    <div>
      <h1 className="text-2xl">Course Publish</h1>
      <button onClick={() => dispatch(setStep(2))}>Back</button>
    </div>
  );
}
