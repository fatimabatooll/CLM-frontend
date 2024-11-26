import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { verify } from '../actions/auth';
import { useParams } from 'react-router-dom';
import VerificationComplete from './VerificationCompleted';

const Activate = ({ verify }) => {
    const [verified, setVerified] = useState(false);
    const { uid, token } = useParams();
    const verify_account = () => {
        verify(uid, token);
        setVerified(true);
    };
    if (verified) {
        return <VerificationComplete />;
    }
    return (
        <div className='container'>
            <div
                className='d-flex flex-column justify-content-center align-items-center'
                style={{ marginTop: '200px' }}
            >
               <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-purple-700">Verify Your Account</h2>
                <button
                    onClick={verify_account}
                    style={{ marginTop: '50px' }}
                    type='button'
                    class="flex-none rounded-md bg-purple-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                    Verify
                </button>
            </div>
        </div>
    );
};
export default connect(null, { verify })(Activate);