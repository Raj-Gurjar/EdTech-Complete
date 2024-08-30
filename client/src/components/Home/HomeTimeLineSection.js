import React from "react";

import { HomeTimeLineSec } from "../../data/HomeTimeLineData";
import TimeLineImg from "../../assets/images/home-img-1.jpg";

export default function HomeTimeLineSection() {
  const items_length = HomeTimeLineSec.length;
  return (
    <div className="my-[100px] flex flex-row gap-7 items-center">
      <div className="w-[45%] flex flex-col items-start gap-10 p-5 ">
        {HomeTimeLineSec.map((item) => (
          <div
            key={item.id}
            className="flex gap-5 justify-center align-middle items-center"
          >
            <div className="h-[50px] w-[50px] bg-white2 rounded-full p-1 relative">
              <img src={item.Logo} alt={`timeline-icon-${item.id}`} />
              {/* Dotted Line */}
              {item.id < items_length && (
                <div className="absolute left-[23px] top-[50px] w-[1px] h-[60px] bg-black8 border-dotted border-l-[2px] border-black6 z-0"></div>
              )}
            </div>

            <div className="items-start flex flex-col align-left">
              <p className="text-[15px] font-semibold">{item.heading}</p>
              <p className="text-[12px] text-black3">{item.Description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="w-[45%] relative ">
        <div>
          <img
            src={TimeLineImg}
            alt="timeline-sec-img"
            className="max-h-[400px] shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]"
          />
        </div>

        <div className="bg-caribbeanGreen9  flex justify-between py-5  px-3 gap-3 text-white uppercase  w-[80%] bottom-[-12%] left-[50%] translate-x-[-50%] absolute shadow-[rgba(0,_0,_0,_0.2)_0px_20px_10px_-7px]">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold">10</h1>
            <p className="text-white4 text-sm">Years of Experience</p>
          </div>
          <div className="border-[1px] border-white6 "></div>
          <div className="flex  items-center pl-2">
            <h1 className="text-3xl font-bold">250</h1>
            <p className="text-white4 text-sm">Type of Courses</p>
          </div>
        </div>
      </div>
    </div>
  );
}
