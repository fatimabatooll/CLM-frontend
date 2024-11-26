
import React from 'react';
import { Container } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Slider.css';

const PartnersSlider = () => {
  const iconData = [
    {
      url: 'https://cdn.mrkhub.com/dochub-frontend/103/images/_modules/partners-slider/amazon.svg',
      width: 100,
      height: 100,
    },
    {
      url: 'https://cdn.mrkhub.com/dochub-frontend/103/images/_modules/partners-slider/salesforce.svg',
      width: 100,
      height: 100,
    },
    {
      url: 'https://cdn.mrkhub.com/dochub-frontend/103/images/_modules/partners-slider/costco.svg',
      width: 100,
      height: 100,
    },
    {
      url: 'https://cdn.mrkhub.com/dochub-frontend/103/images/_modules/partners-slider/netflix.svg',
      width: 100,
      height: 100,
    },
    {
      url: 'https://cdn.mrkhub.com/dochub-frontend/103/images/_modules/partners-slider/delta.svg',
      width: 100,
      height: 100,
    },
    {
      url: 'https://cdn.mrkhub.com/dochub-frontend/103/images/_modules/partners-slider/allstate.svg',
      width: 100,
      height: 100,
    },
    {
      url: 'https://cdn.mrkhub.com/dochub-frontend/103/images/_modules/partners-slider/marriott.svg',
      width: 100,
      height: 100,
    },

    {
      url: 'https://cdn.mrkhub.com/dochub-frontend/103/images/_modules/partners-slider/amazon.svg',
      width: 100,
      height: 100,
    },
    {
      url: 'https://cdn.mrkhub.com/dochub-frontend/103/images/_modules/partners-slider/salesforce.svg',
      width: 100,
      height: 100,
    },
    {
      url: 'https://cdn.mrkhub.com/dochub-frontend/103/images/_modules/partners-slider/costco.svg',
      width: 100,
      height: 100,
    },
    {
      url: 'https://cdn.mrkhub.com/dochub-frontend/103/images/_modules/partners-slider/netflix.svg',
      width: 100,
      height: 100,
    },
    {
      url: 'https://cdn.mrkhub.com/dochub-frontend/103/images/_modules/partners-slider/delta.svg',
      width: 100,
      height: 100,
    },
    {
      url: 'https://cdn.mrkhub.com/dochub-frontend/103/images/_modules/partners-slider/allstate.svg',
      width: 100,
      height: 100,
    },
    {
      url: 'https://cdn.mrkhub.com/dochub-frontend/103/images/_modules/partners-slider/marriott.svg',
      width: 100,
      height: 100,
    },
  ];

  return (
    <Container>
    
      <Container style={{
          display:"flex",
          flexDirection:"row",
          animation: 'moveRightToLeft 15s linear infinite', 
          // border:'3px solid black',
          // width:'100vw',
          // overflowX: 'hidden',
          marginLeft: '-20rem',       
         } }   
        
        
        
        >
      {iconData.map((icon, index) => (
        
      <Carousel
          showStatus={false}
                  showThumbs={false}
                  infiniteLoop
                  autoPlay
                  interval={1000}
                  transitionTime={500}
                  dynamicHeight={false}
                  emulateTouch={true}
                  stopOnHover={false}
                  swipeable={false}
                  showArrows={false}
                  showIndicators={false}
                  key={index}
      >
        
          <div className="carousel-container" key={index}  >
            <img
              src={icon.url}
              alt={`Icon ${index}`}
              style={{ width: icon.width, height: icon.height, margin:'3rem'}}
            />
          </div>
       
      </Carousel>
      
       ))}
       </Container>
    </Container>
  );
};
export default PartnersSlider;