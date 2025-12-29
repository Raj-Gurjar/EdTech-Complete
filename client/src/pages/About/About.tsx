import React from 'react';
import AboutSection1 from './AboutSection1';
import AboutSection2 from './AboutSection2';
import AboutSection3 from './AboutSection3';
import AboutSection4 from './AboutSection4';
import Footer from '../../components/Footer/Footer';

export default function About() {
  return (
    <div className='min-h-screen'>
      <div className='mb-8 sm:mb-12'>
        <AboutSection1/>
      </div>

      <div className='mb-8 sm:mb-12'>
        <AboutSection2/>
      </div>

      <div className='mb-8 sm:mb-12 w-full'>
        <AboutSection3/>
      </div>
      
      <div className='mb-8 sm:mb-12'>
        <AboutSection4/>
      </div>

      <div>
        <Footer/>
      </div>
    </div>
  );
}

