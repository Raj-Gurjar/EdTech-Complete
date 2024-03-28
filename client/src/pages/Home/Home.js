import React from "react";
import { Link } from "react-router-dom";
import "./Home.scss";

//!-- assets
// import home_vid_1 from "../../assets/videos/home-vid-1.mp4";
import home_img_1 from "../../assets/images/home-img-1.jpg";
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
          {/* <video muted loop autoPlay> */}
            {/* <source src={home_vid_1} type="video/mp4" /> */}
          {/* </video> */}
        </div>
      </div>

      {/* //!--- Section 3  */}

      <div className="coding-panel bg-green-300 flex m-20 justify-between gap-10">
        <div className="coding-panel-1 bg-red-200 w-[50%] flex flex-col gap-8">
          <h2>Heading lines</h2>
          <p>Paragraph</p>
          <div className="coding-panel-buttons flex gap-10">
            <button>
              <Link to="/"> Try it now</Link>
            </button>

            <button>
              <Link to="/"> Learn More </Link>
            </button>
          </div>
        </div>
        <div className="coding-panel-2 w-[50%]">
          {/*//! make the code moving by using (React Typing Animation) */}
          <p>
            {
              '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8" />\n<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n<title>Document</title>\n</head>\n<body>\n</body>\n</html>\n'
            }
          </p>
        </div>
      </div>

      {/* //!--- Section 4 add a component  */}
      <div className="course-catalogs"> 
        <h1 className="text-xl">Some Tag line</h1>
        <p>some subtitle</p>
        <p>Add filters also like free,top rated,new, etc.</p>
        <p>
          Create top 4 or 5 top courses card with Title , 20 words description,
          level ,no of lessons + add carousel effect
        </p>
        <button>
          <Link to="/"> See all the Courses</Link>
        </button>
      </div>

        {/* //!--- Section 5  */}
        

        {/* //!--- Section 6  */}

      {/* //!--- Section Footer */}
    </div>
  );
}
