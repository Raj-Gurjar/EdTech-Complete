import React from "react";
import HighlightText from "../../user interfaces/HighlightText";
import Button from "../../user interfaces/Button";
import home_vid_1 from "../../assets/videos/home-vid-1.mp4"

export default function HomeHeadingSec() {
  return (
    <div className="mt-10">
      <div className="brand-texts">
        <h1 className="text-3xl font-bold">
          Empower Your Future with{" "}
          <HighlightText textSize={"text-3xl"} text={"Coding Skills"} />
        </h1>
        <div className="w-[60%] my-4 mx-auto text-black8">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Esse porro
          adipisci cumque soluta neque cupiditate fugit similique quo animi
          aspernatur.
        </div>
      </div>

      <div className="mx-auto flex justify-center gap-10 w-[50%]">
        <Button
          btn_name={"Learn More"}
          btn_link={"/about"}
          btn_color={"bg-yellow9"}
        />
        <Button
          btn_name={"Book a Demo"}
          btn_link={"/"}
          btn_color={"bg-black6"}
        />
      </div>

      <div className="w-2/4 my-10 mx-auto justify-center items-center shadow-[10px_10px_10px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)]">
        <video muted loop autoPlay>
          <source src={home_vid_1} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
