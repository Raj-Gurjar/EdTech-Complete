import React from "react";
import Button from "../../user interfaces/Button";
import HighlightText from "../../user interfaces/HighlightText";
import HomeTimeLineSection from "./HomeTimeLineSection";
import HomeRandomImgSection from "./HomeRandomImgSection";

export default function HomeWhiteSection() {
  return (
    <div className="bg-white text-black py-5 my-4">
      <div className="homepage_grid_bg">
        <div className="w-11/12 max-w-maxContent flex items-center justify-center gap-5 mx-auto">
          <div className="my-10  mb-[100px] flex flex-row gap-10 justify-center text-white">
            <Button
              btn_name={"Explore Courses"}
              btn_link={"/signup"}
              btn_color={"bg-yellow9"}
            />
            <Button
              btn_name={"Learn More"}
              btn_link={"/about"}
              btn_color={"bg-black4"}
            />
          </div>
        </div>

        <div className="flex-row  flex-wrap mx-auto text-left w-11/12 max-w-maxContent flex gap-7 ">
          <div className="w-[45%] ">
            <p className="text-2xl font-semibold">
              Get the Skills for{" "}
              <HighlightText
                textSize={"text-2xl"}
                text={"Job that is in demand"}
              />
            </p>
          </div>

          <div className="flex flex-col gap-5 w-[45%] ">
            <p className="text-[14px] font-semibold text-black3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Repellendus ipsum laudantium id, porro explicabo quasi incidunt
              minus soluta voluptatibus maiores?
            </p>
            <div>
              <Button
                btn_name={"Learn More"}
                btn_link={"/signup"}
                btn_color={"bg-yellow7"}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-11/12 mx-auto">
        <HomeTimeLineSection />
      </div>

      <div>
        <HomeRandomImgSection/>
      </div>
    </div>
  );
}
