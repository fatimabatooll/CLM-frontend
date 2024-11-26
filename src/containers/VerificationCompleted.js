import React from 'react';
import { Link } from 'react-router-dom';
import verificationImage from './verification.jpg';

const VerificationComplete = () => {
  return (
    <div className='container'>
      <div className='d-flex flex-column justify-content-center align-items-center' style={{ marginTop: '200px' }}>
        {/* Add an image before the text */}
        <img
          src={verificationImage}
          alt="Verification Completed"
          style={{ width: '100px', height: 'auto', marginBottom: '20px' }}
        />

        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-cyan-900'>
          Verification Completed!
        </h2>

        {/* Add a celebration icon or any other content */}
        <Link to='/login' className='text-cyan-500 hover:underline mt-4'>
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default VerificationComplete;
