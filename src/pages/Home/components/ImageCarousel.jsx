
import React from 'react';
import slider1 from '../../../images/slider1.webp';
import slider2 from '../../../images/slider1.webp'; 
import slider3 from '../../../images/slider1.webp'; 
import slider4 from '../../../images/slider1.webp'; 
import './OverviewSlider.css';

const OverviewSlider = () => {
    return (
      

      
      <div style={{
        display:'flex',
        flexDirection:'row',
        width:'100%',
        // border:'2px solid black',
        paddingTop:'4rem',
        justifyContent: 'space-around'

      }} className="font-body">

        <div style={{
          backgroundColor: '#6254B6'
        }}>
          <img src={slider1}/>
        </div>
        <div style={{

          marginTop:'5rem'
        }}>
          <h1 style={{
            fontSize:'2rem',
            color:'#6254B6',
            textAlign:'center',
            fontWeight:'bolder'
          }} className="font-body">
           Simplify data collection</h1>
         <p style={{
          fontSize:'1.2rem',
          // lineHeight:'5rem',
       textAlign:'center',
       width:'30rem',
       padding:'10px'
       

         }} className="font-body">Build fillable PDF forms and make them public to instantly start collecting data instantly. For quick distribution and fast results, create reusable templates. No more printing, scanning, or photocopying.</p>
        </div>
      </div>
      
    );
  };
  
  export default OverviewSlider;
  