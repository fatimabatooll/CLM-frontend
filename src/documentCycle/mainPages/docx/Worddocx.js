import React from 'react';
// import Sidebar from '../Sidebar/Sidebar'
const WordDocx = () => {
  const params = new URLSearchParams(window.location.search);
  const selectedFileName = 'https://firebasestorage.googleapis.com' + params.get('doc');
  return (
    <div className="App">
      <iframe  className="flex justify-center items-center h-screen"
        title="PDF Viewer"
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedFileName)}&embedded=true`}
        width="460%"
        height="90%"
      ></iframe>
    </div>
  );
};
export default WordDocx;
