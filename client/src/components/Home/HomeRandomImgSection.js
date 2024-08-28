import React from "react";
import HighlightText from "../../user interfaces/HighlightText";
import HomeRandomImg1 from "../../assets/images/home-img-1.jpg"
import Button from "../../user interfaces/Button";

export default function HomeRandomImgSection() {
  return (
    <div className="mt-[150px] mx-auto w-11/12 items-center">
      <div className=" capitalize">
        <h1 className="text-3xl font-bold text-center">
          Your Swiss Knife for {" "}
          <HighlightText text={"learning any language"} textSize={"text-3xl"} />
        </h1>
      </div>
      <div className="mt-2 w-[70%] mx-auto text-base text-black3 font-medium">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius nostrum placeat fugit voluptas doloremque accusantium, ipsam non ab animi atque.</p>
      </div>

      <div className="flex flex-row items-center justify-center mt-5 gap-4">
          <img src={HomeRandomImg1} alt="random-img-1" className="h-[300px] w-[300px]"/>
          <img src={HomeRandomImg1} alt="random-img-2" className="h-[300px] w-[300px]"/>
          <img src={HomeRandomImg1} alt="random-img-3" className="h-[300px] w-[300px]"/>
      </div>

      <div className="items-center justify-center my-6 flex">
        <Button btn_name={"Learn More"} btn_link={"/about"} btn_color={"bg-yellow8"}/>
      </div>
    </div>
  );
}
