import React from "react";
import { Link } from "react-router-dom";
import "./Home.scss";

//!-- assets
import home_vid_1 from "../../assets/videos/home-vid-1.mp4";
import home_img_1 from "../../assets/images/home-img-1.jpg";
//!-- icons
import { FaLongArrowAltRight } from "react-icons/fa";
import Footer from "../../components/Footer/Footer";
import ReviewSlider from "../../components/Sliders/ReviewSlider";
import HighlightText from "../../user interfaces/HighlightText";
import SideButtons from "../../user interfaces/Button";
import Button from "../../user interfaces/Button";
import CodeSection1 from "../../components/Home/CodeBlock";
import CodeBlock from "../../components/Home/CodeBlock";
import HomeWhiteSection from "../../components/Home/HomeWhiteSection";
import BecomeInstructor from "../../components/Home/BecomeInstructor";

export default function Home() {
  return (
    <div className="pb-10 relative mx-auto    items-center text-center justify-between text-white">
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
      {/* <div className="bg-green-400">
        <ReviewSlider />
      </div> */}

      {/* //!--- Section Footer */}
      {/* <Footer /> */}
    </div>
  );
}
