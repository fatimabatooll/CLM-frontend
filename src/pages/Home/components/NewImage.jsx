import React from 'react';
import './OverviewSlider.css';
import { styled } from '@mui/system';
import { Typography } from '@mui/material';
const slides = [
  {
    image: require('../../../images/slider2.webp'),
    title: 'Sign PDFs and signatures.',
    description: 'Getting a document electronically signed has never been easier. Specify who needs to sign and where. Then, send your document with a click. Instant status notifications.',
    backgroundColor: '#6254B6',
  },

  {
    image: require('../../../images/slider2.webp'),
    title: 'Work flexibly in Google',
    description: 'With DocHub PDF editing and eSigning capabilities seamlessly integrated with Google Workspace, your documents get done safely without ever leaving your favorite Google Apps.',
    backgroundColor: '#6254B6',
  },
  
  
];


const Heading = styled(Typography)({
    marginTop:'2rem',
    fontSize: '2rem',
    // fontWeight:'bolder',
    textAlign:'center'  });

const NewImage = () => {
  return (
<>
    <Heading className="font-body">
    Document editing, signing, <br />sharing, and forms made easy
    </Heading>
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      paddingTop: '4rem',
      justifyContent: 'space-between',
    }}>
      {slides.map((slide, index) => (
        <div key={index} style={{ backgroundColor: slide.backgroundColor }} className="font-body">
          <img src={slide.image} alt={`Slide ${index + 1}`} />
          <div style={{ marginTop: '3rem' }}>
            <h1  className="font-body" style={{
              fontSize: '2rem',
              color: 'white',
              textAlign: 'center',
              // fontWeight: 'bolder',
            }}>
              {slide.title}
            </h1>
            <p className="font-body" style={{
              fontSize: '1.2rem',
              textAlign: 'center',
              width: '30rem',
              padding: '10px',
            }}>{slide.description}</p>
          </div>
        </div>
      ))}
    </div>
    </>
  );
};

export default NewImage;