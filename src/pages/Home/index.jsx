import React from 'react';
import MainHeading from './components/MainHeading';
import FirstSlider from './components/FirstSlider';

import Header from './components/Header';
import Footer from './components/Footer';
import AccordianText from './components/AccordianText';
import LogoSlider from './components/BrandCarousel';

const Home = () => {
  return (
    <>
    <Header/>
    <MainHeading/>
    <LogoSlider/>
    <FirstSlider/>
    <AccordianText/>
    <Footer/>
    </>
  )
}

export default Home