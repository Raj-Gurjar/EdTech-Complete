import React from "react";
import img1 from "../../assets/images/home-img-1.jpg";
import HighlightText from "../../user interfaces/HighlightText";

export default function AboutSection1() {
  // Array of image data
  const images: string[] = [img1, img1, img1];

  return (
    <div className="bg-black4 flex justify-center flex-col text-center items-center pt-10">
      <div className="w-10/12 items-center relative">
        <div className="text-3xl font-bold mb-3">
          <h1>Driving Innovation in Online Education for a</h1>
          <h2>
            <HighlightText text={"Bright Future"} />
          </h2>
        </div>
        <div className="w-[70%] mx-auto">
          <p className="text-[14px] text-white4 mb-6">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut quidem
            dicta, molestiae corrupti nam nobis aliquid porro modi similique
            totam? Deserunt, quis voluptatem inventore in voluptates quos.
            Explicabo, modi nobis!
          </p>
        </div>
      </div>

      <div className="flex justify-center w-10/12 bg-red1 gap-3">
        {images.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`img${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

