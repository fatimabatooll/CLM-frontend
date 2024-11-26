
import React, { useState, useEffect } from 'react';
import { Client } from '@microsoft/microsoft-graph-client';
import { useIsAuthenticated } from '@azure/msal-react';

const MicrosoftWord = () => {
    const [documents, setDocuments] = useState([]);
    const [documentName, setDocumentName] = useState('');
    const isAuthenticated = useIsAuthenticated();

    useEffect(() => {
        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
          console.error("Access token not found");
          return;
        }

        if (isAuthenticated) {
          const client = Client.init({
            authProvider: (done) => {
              done(null, accessToken); 
            },
          });

          client
            .api('/me/drive/root/search(q=\'.docx\')')
            .version('v1.0')
            .select('name,id,webUrl')
            .top(100)
            .get()
            .then((response) => {
              setDocuments(response.value);
            })
            .catch((error) => console.error("Failed to retrieve documents:", error));
        }
    }, [isAuthenticated]);

    const handleCreateDocument = () => {
        const accessToken = localStorage.getItem("access");
        if (!accessToken || !documentName.trim()) {
            console.error("Access token not found or document name is empty");
            return;
        }

        const client = Client.init({
            authProvider: (done) => {
              done(null, accessToken); 
            },
        });

        const fileName = `${documentName}.docx`;
        client
            .api('https://graph.microsoft.com/v1.0/me/drive/root/children')
            .version('v1.0')
            .post({
                name: fileName,
                file: {},
                "@microsoft.graph.conflictBehavior": "rename"
            })
            .then(() => {
                alert("Document created successfully!");
                setDocumentName('');
            })
            .catch((error) => console.error("Failed to create document:", error));
    };

    return (
        <div>
          <h2>Word Documents</h2>
          <input
            type="text"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            placeholder="Enter document name"
          />
          <button onClick={handleCreateDocument}>Create Document</button>
          <ul>
            {documents.map((doc) => (
              <li key={doc.id}>
                <a href={doc.webUrl} target="_blank" rel="noopener noreferrer">{doc.name}</a>
              </li>
            ))}
          </ul>
        </div>
    );
};

export default MicrosoftWord;