import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';
import { BrowserRouter as Router, Route, Navigate, Link } from 'react-router-dom';

const Navbar = ({ logout, isAuthenticated }) => {
    const [redirect, setRedirect] = useState(false);

    const logout_user = () => {
        logout();
        setRedirect(true);
    };

    const guestLinks = () => (
        <Fragment>
            <li className='nav-item'>
                <Link className='nav-link' to='/login'>
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                     Login
               </button>
                </Link>
            </li>
            <li className='nav-item'>
                <Link className='nav-link' to='/signup'>
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                     Sign Up
               </button>
                </Link>
            </li>
        </Fragment>
    );

    const authLinks = () => (
        <li className='nav-item'>
            <a className='nav-link cursor-pointer' onClick={logout_user}>Logout</a>
        </li>
    );

    return (
        <Fragment>
            <nav className="bg-white-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link className='text-black text-2xl font-bold' to='/'>DocuVault</Link>
                    <button 
                        className='block lg:hidden focus:outline-none'
                        aria-label='Toggle navigation'
                    >
                        <span className='text-white text-3xl'>
                            &#8801;
                        </span>
                    </button>
                    <div className='hidden lg:flex lg:items-center lg:w-auto' id='navbarNav'>
                        <ul className='lg:flex lg:items-center lg:justify-end lg:flex-1 space-x-4'>
                            <li className='nav-item'>
                                <Link class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" to='/'>Home</Link>
                            </li>
                            {isAuthenticated ? authLinks() : guestLinks()}
                        </ul>
                    </div>
                </div>
            </nav>
            {redirect ? <Link to='/' /> : null}
        </Fragment>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { logout })(Navbar);