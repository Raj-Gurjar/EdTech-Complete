import React from 'react';
import AboutSection1 from './AboutSection1';
import AboutSection2 from './AboutSection2';
import AboutSection3 from './AboutSection3';
import AboutSection4 from './AboutSection4';
import Footer from '../../components/Footer/Footer';
import '../Home/Home.scss';

export default function About() {
  return (
    <div className='min-h-screen relative w-full overflow-hidden bg-blackBg'>
      {/* Purple Gradient Background Patches */}
      <div className="home-gradient-bg fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="gradient-patch-1"></div>
        <div className="gradient-patch-2"></div>
        <div className="gradient-patch-3"></div>
        <div className="gradient-patch-4"></div>
        <div className="gradient-patch-5"></div>
      </div>

      <div className='mb-8 sm:mb-12 relative'>
        <AboutSection1/>
      </div>

      <div className='mb-8 sm:mb-12 relative'>
        <AboutSection2/>
      </div>

      <div className='mb-8 sm:mb-12 w-full relative'>
        <AboutSection3/>
      </div>
      
      <div className='mb-8 sm:mb-12 relative'>
        <AboutSection4/>
      </div>

      <div className='relative'>
        <Footer/>
      </div>
    </div>
  );
}

