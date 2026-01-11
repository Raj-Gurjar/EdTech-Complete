import React from "react";
import "./Home.scss";
import Footer from "../../components/Footer/Footer";
import CodeBlock from "../../components/Home/CodeBlock";
import HomeWhiteSection from "../../components/Home/HomeWhiteSection";
import BecomeInstructor from "../../components/Home/BecomeInstructor";
import HomeHeadingSec from "../../components/Home/HomeHeadingSec";

export default function Home() {
  return (
    <div className="relative w-full overflow-hidden bg-blackBg">
      {/* Purple Gradient Background Patches - Pidge.in inspired */}
      <div className="home-gradient-bg fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="gradient-patch-1"></div>
        <div className="gradient-patch-2"></div>
        <div className="gradient-patch-3"></div>
        <div className="gradient-patch-4"></div>
        <div className="gradient-patch-5"></div>
      </div>

      {/* Hero Section with Become Instructor CTA - First 100vh */}
      <section className="relative w-full" style={{ minHeight: '100vh' }}>
        {/* Hero Background Image - First 100vh */}
        <div className="hero-gradient-bg">
          <img
            decoding="auto"
            src="https://framerusercontent.com/images/srZGNjttwpCu3fvEQl7I0ozB5ZU.png?width=1024&height=1024"
            srcSet="https://framerusercontent.com/images/srZGNjttwpCu3fvEQl7I0ozB5ZU.png?scale-down-to=512&width=1024&height=1024 512w, https://framerusercontent.com/images/srZGNjttwpCu3fvEQl7I0ozB5ZU.png?width=1024&height=1024 1024w"
            sizes="min(100vw, 1920px)"
            alt=""
          />
        </div>
        <div className="relative z-10 pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-24">
          <div className="mx-auto max-w-maxContent px-4 sm:px-6 lg:px-8">
            <HomeHeadingSec />
          </div>
        </div>
      </section>

      {/* Features Section with Code Blocks */}
      <section className="py-16 sm:py-20 lg:py-28 w-full">
        <div className="mx-auto max-w-maxContent px-4 sm:px-6 lg:px-8">
          <div className="w-full mx-auto space-y-20 sm:space-y-24 lg:space-y-32">
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
              bgGradient="shadow-[0_10px_20px_rgba(96,_28,_255,_0.4)]"
              codeText={`function greet() {
    console.log("Welcome to SkillScript!");
    return "Start Learning Today!";
}

greet();`}
            />
          </div>
        </div>
      </section>

      {/* White Section with Timeline - Full Width Background */}
      <HomeWhiteSection />

      {/* Become Instructor CTA Section */}
      <section className="py-16 sm:py-20 lg:py-28 w-full">
        <div className="mx-auto max-w-maxContent px-4 sm:px-6 lg:px-8">
          <BecomeInstructor />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}


