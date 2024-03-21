import React from "react";
import { Link } from "react-router-dom";
import "./Home.scss";

//!-- assets
import home_vid_1 from "../../assets/videos/home-vid-1.mp4"
//!-- icons
import { FaLongArrowAltRight } from "react-icons/fa";

export default function Home() {
  return (
    <div className="section-home relative mx-auto  flex  flex-col items-center text-center justify-center bg-[#323030] text-white-900">
      {/* //!--- Section 1 */}
      <div className="home-sec-1">
        <div className="bg-red-600 p-2">
          <Link to="/signup">Become an instructor</Link>
          <FaLongArrowAltRight />
        </div>
      </div>

      {/* //!--- Section 2  */}
      <div className="home-sec-2">
        <div className="brand-texts">
          <h1 className="text-2xl">Brand Name</h1>
          <h3 className="text-xl">Tag Line</h3>
          <p>Some info</p>
        </div>
        <div className="home-buttons">
          <button className="learn-more mr-2">
            <Link to="/about">Learn More</Link>
          </button>
          <button className="book-demo">
            <Link to="/">Book Demo</Link>
          </button>
        </div>

        <div className="video-banner w-2/4 my-10 mx-auto justify-center items-center bg-blue-500 p-5">
          <video muted loop autoPlay>
            <source src={home_vid_1} type="video/mp4" />
          </video>
        </div>
      </div>

      {/* //!--- Section 3  */}

      

      {/* //!--- Section Footer */}
    </div>
  );
}
