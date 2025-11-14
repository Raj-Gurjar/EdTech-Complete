import React from "react";
import { Link } from "react-router-dom";
import "./Home.scss";
import Footer from "../../components/Footer/Footer";
import CodeBlock from "../../components/Home/CodeBlock";
import HomeWhiteSection from "../../components/Home/HomeWhiteSection";
import BecomeInstructor from "../../components/Home/BecomeInstructor";
import HomeHeadingSec from "../../components/Home/HomeHeadingSec";
import { FaLongArrowAltRight } from "react-icons/fa";

export default function Home() {
  return (
    <div className="relative mx-auto max-w-maxContent w-full overflow-hidden">
      {/* Hero Section with Become Instructor CTA */}
      <section className="relative pt-4 pb-8 sm:pt-6 sm:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <Link to="/signup" className="inline-block">
            <div className="bg-gradient-to-r from-yellow8 to-yellow7 group rounded-full font-semibold mx-auto text-black2 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md w-fit px-4 sm:px-6 py-2 sm:py-2.5 flex items-center gap-2">
              <span className="text-sm sm:text-base">Become an instructor</span>
              <FaLongArrowAltRight className="text-base sm:text-lg group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
        <HomeHeadingSec />
      </section>

      {/* Features Section with Code Blocks */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full mx-auto space-y-16 sm:space-y-20 lg:space-y-24">
          <CodeBlock
            position="flex-col lg:flex-row"
            title="Unlock Your Coding Potential"
            text="Master in-demand programming skills with our comprehensive courses. From beginner basics to advanced concepts, learn at your own pace with expert instructors and hands-on projects."
            btn1="Explore Courses"
            btn2="Watch Demo"
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
            position="flex-col lg:flex-row-reverse"
            title="Build Real-World Projects"
            text="Apply what you learn through practical projects. Build portfolio-worthy applications, solve real problems, and gain the confidence to tackle any coding challenge."
            btn1="View Projects"
            btn2="Learn More"
            bgGradient="shadow-[0_10px_20px_rgba(240,_46,_170,_0.7)]"
            codeText={`function greet() {
    console.log("Welcome to EdTech!");
    return "Start Learning Today!";
}

greet();`}
          />
        </div>
      </section>

      {/* White Section with Timeline */}
      <HomeWhiteSection />

      {/* Become Instructor CTA Section */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <BecomeInstructor />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}