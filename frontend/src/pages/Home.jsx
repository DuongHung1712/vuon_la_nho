import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import AiSuggest from '../components/AiSuggest'

const Home = () => {
  return (
    <div>
      <Hero/>
      <LatestCollection />
      <BestSeller/>
      <AiSuggest/>
      <OurPolicy/>
      <NewsletterBox/>
    </div>
  )
}

export default Home
