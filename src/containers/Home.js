import React, { useState } from 'react'
import FeatureTop from '../components/FeatureTop'
import PdfEdit from '../components/PdfEdit'
import axios from 'axios';
import Navbar from '../components/Navbar';


const Home = () => {
  const [user,setuser]=useState('');
  const obj = JSON.parse(localStorage.getItem("user"));
  console.log(obj);
  setuser(obj);
  return (
    <div>
      <label for="last_name" class="block text-sm font-medium leading-6 text-gray-900">Last{user.last_name} </label>
      {/* <Navbar/>
      <FeatureTop/>

      <PdfEdit/> */}
    </div>
  )
}

export default Home