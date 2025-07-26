import React from 'react'
import LandingHeader from '../components/LandingHeader'
import LandingMain from '../components/LandingMain'
import LandingCards from '../components/LandingCards'
import "../css/LandingPage.css"
import BankingFAQ from '../components/BankingFAQ'
import BlogSlider from '../../../Components/Component/BlogSlider'
import OurServices from '../components/OurServices'
import ChatBot from "react-chatbotify";
const LandingPage = () => {
  return (
    <div>
      <ChatBot/>
      <LandingHeader />
      <LandingMain />
      <div className='container'>
        <LandingCards />
      </div>
      {/* <div className='container my-5'>
          <OurServices/>
      </div> */}
      <div className='container'>
        <h3 className='Heading  my-5'>Watch it in Action</h3>
        <div>
          <iframe
            className='header-vedio'
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      <div className='container'>
      <h3 className='Heading  mt-5'>Review's</h3>
          <BlogSlider/>
      </div>
      <div className='container'>
        <h3 className='Heading  my-5'>Frequently Asked Questions</h3>
        <BankingFAQ />
      </div>
      <div className='landingFotter mt-5 d-flex justify-content-center align-items-center'>
        <h3 className='Landing-Footer-text mx-5'>Experience <span className='special'>The Magic of </span> Digital Banking</h3>
      </div>
    </div>
  )
}

export default LandingPage
