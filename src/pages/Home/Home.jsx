import React from 'react'
import FreeQuoteCTA from '../../components/call to action banner/FreeQuoteCTA'
import Hero from '../../components/Hero section/Hero'
import HowItWorks from '../../components/how it works section/HowItWorks'
import KeyBenefits from '../../components/key benefits section/KeyBenefits'
import ScrapGuideSection from '../../components/scrap guide section(FAQs)/ScrapGuideSection'
import TestimonialsSection from '../../components/testimonials section/TestimonialsSection'

const Home = () => {
  return (
<>
<Hero/>
<HowItWorks/>
<KeyBenefits/>
<TestimonialsSection/>
<ScrapGuideSection/>
<FreeQuoteCTA
  heading="Still have questions?"
  paragraph="Get in touch or get your free quote in under 60 seconds. It's fast, easy and completely free."
  buttonText="Get My Free Quote"
/>

</>
  )
}

export default Home