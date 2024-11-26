// Create a new file named PageContext.js
import React from 'react';

const PageContext = React.createContext({
  currentPage: 'Dashboard', // Default value
  setCurrentPage: () => {} // Placeholder function
});

export default PageContext;