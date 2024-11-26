import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { Client } from '@microsoft/microsoft-graph-client';
import _ from 'lodash'; 
import { BiSearchAlt } from "react-icons/bi";
import '../../sideBarPages/outlookEmail/outlookEmail.css';
import './Search.css';

const EmailSearch = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearchEmails = _.debounce(async () => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      console.error("Access token not found");
      return;
    }

    const client = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });

    try {
      const response = await client.api('/me/messages')
        .version('v1.0')
        .select('subject,from,bodyPreview,body,subject,toRecipients')
        .query({ '$search': `"${searchQuery}"` })
        .top(100)
        .get();

      onSearchResults(response.value);
    } catch (error) {
      console.error("Error searching emails:", error);
    }
  }, 100); 

  useEffect(() => {
    if (searchQuery.length > 0) { 
      debouncedSearchEmails();
    } else {
      onSearchResults([]); 
    }

    return () => {
      debouncedSearchEmails.cancel();
    };
  }, [searchQuery]);

  return (
    <div className="email-search" >
              <input type="text"    value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Search emails" />
              <BiSearchAlt className="search-icon" />
            </div>
    
  );
};

export default EmailSearch;