import React from "react";
import RenderFormSteps from "./RenderFormSteps";

export default function CreateCourses() {
  return (
    <div>
      <h1 className="text-2xl">Create Course</h1>

      <div>
        <RenderFormSteps/>
      </div>

      <div>
        Instruction !! 
        Add 5 or 6 instructions
      </div>
    </div>
  );
}
