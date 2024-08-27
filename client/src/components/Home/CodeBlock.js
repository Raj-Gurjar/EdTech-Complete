import React from "react";
import Button from "../../user interfaces/Button";
import { TypeAnimation } from "react-type-animation";

export default function CodeBlock({
  position,
  title,
  text,
  btn1,
  btn2,
  codeText,
  bgGradient,
}) {
  const num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12];

  return (
    <div className={`flex ${position} my-20 justify-between gap-10 ` }>
      <div className="w-[50%] flex flex-col gap-8">
        <div>{title}</div>
        <div className="text-black6 font-bold">{text}</div>

        <div className="flex gap-7 mt-7">
          <Button btn_name={btn1} btn_link={"/"} btn_color={"bg-yellow8"} />
          <Button btn_name={btn2} btn_link={"/"} btn_color={"bg-black8"} />
        </div>
      </div>

      <div className={`h-fit flex flex-row text-[14px] w-[100%] py-4 lg:w-[500px] ${bgGradient}`}>
        <div className="w-[10%]  flex flex-col text-black7 font-inter font-bold">
          {num.map((i, ind) => (
            <p>{i}</p>
          ))}
        </div>
        <div className={`w-[90%] text-left flex flex-col gap-2 font-bold font-mono  pr-2 `}>
          <TypeAnimation
            sequence={[codeText, 500, ""]}
            repeat={Infinity}
            cursor={true}
            omitDeletionAnimation={false}

            style={
              {
                whiteSpace : "pre-line",
                display:"black",
              }
            }
          />
        </div>
      </div>
    </div>
  );
}
