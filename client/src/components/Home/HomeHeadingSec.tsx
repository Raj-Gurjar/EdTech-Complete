import React, { useState, useRef, useEffect } from "react";
import HighlightText from "../../user interfaces/HighlightText";
import PrimaryCTA from "../../user interfaces/PrimaryCTA";
import SecondaryCTA from "../../user interfaces/SecondaryCTA";
import FramerImageEffect from "./FramerImageEffect";
import { FaPlay } from "react-icons/fa";

export default function HomeHeadingSec() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    setIsPlaying(true);
    setVideoError(false);
  };

  // Load and play video when isPlaying becomes true
  useEffect(() => {
    if (isPlaying && videoRef.current) {
      const video = videoRef.current;
      
      // Load the video
      video.load();
      
      // Try to play the video
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Video is playing
            setIsVideoLoaded(true);
          })
          .catch((error) => {
            console.error("Error playing video:", error);
            setVideoError(true);
            setIsVideoLoaded(true); // Hide loading even on error
          });
      }
    }
  }, [isPlaying]);

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
  };

  const handleVideoError = () => {
    console.error("Video failed to load");
    setVideoError(true);
    setIsVideoLoaded(true); // Hide loading on error
  };

  const handleCanPlay = () => {
    setIsVideoLoaded(true);
  };

  const handleVideoEnded = () => {
    // Reset to show thumbnail and play button again
    setIsPlaying(false);
    setIsVideoLoaded(false);
    setVideoError(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0; // Reset video to start
    }
  };

  // Thumbnail image - using a placeholder that matches the video theme
  const thumbnailUrl = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="mt-6 sm:mt-8 lg:mt-12">
      {/* Heading and Description */}
      <div className="text-center space-y-4 sm:space-y-6 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
          Empower Your Future with{" "}
          <HighlightText textSize={"text-3xl sm:text-4xl md:text-5xl lg:text-6xl"} text={"Coding Skills"} />
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white4 max-w-2xl mx-auto leading-relaxed">
          Transform your career with industry-leading courses taught by experts. 
          Learn cutting-edge technologies and build the skills employers are looking for.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-8 sm:mt-10 lg:mt-12 px-4">
        <PrimaryCTA to="/allCourses" className="w-full sm:w-auto">
          Browse Courses
        </PrimaryCTA>
        <SecondaryCTA to="/about" className="w-full sm:w-auto">
          Learn More
        </SecondaryCTA>
      </div>

      {/* Video Section with Lazy Loading */}
      <div className="mt-8 sm:mt-10 lg:mt-16 mx-auto max-w-4xl px-3 sm:px-4">
        <FramerImageEffect className="w-full">
          <div className="relative w-full aspect-video rounded-[19px] overflow-hidden bg-black2">
            {/* Thumbnail with Play Button - shown before video plays */}
            {!isPlaying && (
              <div className="absolute inset-0 z-10 cursor-pointer group" onClick={handlePlayClick}>
                <img
                  src={thumbnailUrl}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Gradient overlay for better play button visibility */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-purple6/90 group-hover:bg-purple6 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300">
                    <FaPlay className="text-white text-2xl sm:text-3xl lg:text-4xl ml-1" />
                  </div>
                </div>
              </div>
            )}

            {/* Video - only loaded when play is clicked */}
            {isPlaying && (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                onLoadedData={handleVideoLoaded}
                onCanPlay={handleCanPlay}
                onError={handleVideoError}
                onEnded={handleVideoEnded}
                preload="none"
              >
                <source src="https://cdn2.gro.care/e6c97ff1a07e_1768238676032.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            {/* Loading state while video loads */}
            {isPlaying && !isVideoLoaded && !videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black2 z-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-purple6 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-white4 text-sm">Loading video...</p>
                </div>
              </div>
            )}

            {/* Error state */}
            {isPlaying && videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black2 z-20">
                <div className="flex flex-col items-center gap-4 text-center px-4">
                  <p className="text-white4 text-sm">Unable to load video. Please try again later.</p>
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setIsVideoLoaded(false);
                      setVideoError(false);
                    }}
                    className="px-4 py-2 bg-purple6 hover:bg-purple5 text-white rounded-lg transition-colors text-sm"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </FramerImageEffect>
      </div>
    </div>
  );
}

