import React from "react";
import { Link } from "react-router-dom";
import "./Home.scss";

//!-- assets

//!-- icons
import { FaLongArrowAltRight } from "react-icons/fa";
import Footer from "../../components/Footer/Footer";
import ReviewSlider from "../../components/Sliders/ReviewSlider";

import CodeBlock from "../../components/Home/CodeBlock";
import HomeWhiteSection from "../../components/Home/HomeWhiteSection";
import BecomeInstructor from "../../components/Home/BecomeInstructor";
import HomeHeadingSec from "../../components/Home/HomeHeadingSec";

export default function Home() {
  return (
    <div className=" relative mx-auto max-w-maxContent   items-center text-center justify-between text-white">
      {/* //!--- Section 1 */}
      <div>
        <Link to="/signup">
          <div className="bg-black2 group rounded-full font-bold mx-auto text-black9 transition-all duration-200 hover:scale-75 w-fit mt-10 p-1">
            <div className=" flex flex-row px-3 py-2 gap-2 items-center">
              <p>Become an instructor</p>
              <p className="text-xl">
                <FaLongArrowAltRight />
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* //!--- Section 2  */}
      <HomeHeadingSec />

      {/* //!--- Section 3  */}
      <div className="w-11/12 mx-auto">
        <CodeBlock
          position={"flex-row"}
          title={"Unlock Your Coding Potential"}
          text={
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quasi doloribus sequi amet recusandae nobis ad commodi obcaecati. Enim, repellendus nemo! Rerum ad laudantium vel aliquam dolor quas nostrum fuga dolorem!"
          }
          btn1={"Try Now"}
          btn2={"Learn more"}
          codeText={`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Basic HTML</title>
        </head>
        <body>
            <h1>Hello, World!</h1>
        </body>
        </html>`}
        />

        <CodeBlock
          position={"flex-row-reverse"}
          title={"Unlock Your Coding Potential"}
          text={
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quasi doloribus sequi amet recusandae nobis ad commodi obcaecati. Enim, repellendus nemo! Rerum ad laudantium vel aliquam dolor quas nostrum fuga dolorem!"
          }
          btn1={"Try Now"}
          btn2={"Learn more"}
          bgGradient={"shadow-[0_10px_20px_rgba(240,_46,_170,_0.7)]"}
          codeText={`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Basic HTML</title>
        </head>
        <body>
            <h1>Hello, World!</h1>
        </body>
        </html>`}
        />
      </div>

      {/* //!--- Section 4 add a component  */}

      <HomeWhiteSection />

      {/* //!--- Section 5  */}
      <div>
        <BecomeInstructor />
      </div>

      {/* //!--- Section 6  */}
      <div className="bg-green-400">
        <ReviewSlider />
      </div>

      {/* //!--- Section Footer */}
      <Footer />
    </div>
  );
}
