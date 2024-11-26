import React from 'react';
import { styled } from '@mui/system';
import {Container, Typography } from '@mui/material';
import OverviewSlider from './ImageCarousel';
import NewImage from './NewImage';



const Heading = styled(Typography)({
    marginTop:'2rem',
    fontSize: '2rem',
    // fontWeight:'bolder',
    textAlign:'center'  });

  const FirstSlider = () => {
    return (
<Container >

    <Heading className="font-body" >
   <p className='font-body'> Document editing, signing, <br />sharing, and forms made easy</p>
    </Heading>
    <OverviewSlider/>
    <NewImage/>
</Container>

    )}

    export default FirstSlider;

    
    
      