import React from 'react'
import AboutSection1 from './AboutSection1'
import AboutSection2 from './AboutSection2'
import AboutSection3 from './AboutSection3'
import AboutSection4 from './AboutSection4'
import Footer from '../../components/Footer/Footer'

export default function About() {
  return (
    <div className=''>
      <div>
        <AboutSection1/>
      </div>

      <div>
        <AboutSection2/>
      </div>

      <div>
        <AboutSection3/>
      </div>
      <div>
        <AboutSection4/>
      </div>

      <div>
          <Footer/>
      </div>
    </div>
  )
}
