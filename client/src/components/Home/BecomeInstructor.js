import React from "react";
import Button from "../../user interfaces/Button";
import InstructorImg from "../../assets/images/home-img-1.jpg";
import HighlightText from "../../user interfaces/HighlightText";

export default function BecomeInstructor() {
  return (
    <div className="flex w-11/12 mx-auto justify-between gap-5 mt-[50px]">
      <div className="w-[45%]">
        <img src={InstructorImg} alt="instructor-img" className="shadow-[-10px_-10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)]" />
      </div>
      <div className="w-[45%] gap-6 flex flex-col justify-center text-left">
        <div className="">
          <h1 className="w-[50%] text-3xl font-bold mb-3 leading-5">
            Become an <HighlightText text={"Instructor"} />
          </h1>
          <p className="w-[70%] text-sm text-white2">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Exercitationem, provident.
          </p>
        </div>

        <div>
          <Button
            btn_name={"Go on"}
            btn_link={"/signup"}
            btn_color={"bg-yellow8"}
          />
        </div>
      </div>
    </div>
  );
}
