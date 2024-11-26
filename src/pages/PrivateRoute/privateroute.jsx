import React from 'react';
import { Navigate } from 'react-router-dom';
import SideNavbar from '../Sidebar/Sidebar';
import HomeNav from '../../Navbar/homeNav/HomeNav';
import PageContext from './ContextApi/CreateContext'; 


const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  content: {
    display: 'flex',
    flex: 1,
  },
};


export default function Privateroute({ children }) {
  const [currentPage, setCurrentPage] = React.useState('Dashboard');
  
  const value = { currentPage, setCurrentPage };


  return (
    <PageContext.Provider value={value}>
      <div style={styles.container}>
        <HomeNav /> 
        <div style={styles.content}>
          <SideNavbar /> 
          {children}
        </div>
      </div>
    </PageContext.Provider>
  );
}