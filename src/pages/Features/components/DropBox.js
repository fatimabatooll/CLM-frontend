import React from 'react';

const DropBox = () => {
  const containerStyle = {
    backgroundColor: '#9975e7',
    color: '#fff',
    width: '100%',
    height: '700px',
  };

  const textContainerStyle = {
    color: '#fff',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  return (
    <div className="" style={containerStyle}>
      <div className="mx-auto max-w-6xl px-2 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-0 sm:py-0 lg:max-w-none lg:py-6">
          <div className="mx-auto max-w-3xl sm:px-6 lg:grid lg:max-w-6xl lg:grid-cols-2 lg:gap-x-16 lg:px-16">
          <div className="group relative">
              <div className="relative h-80 mt-60 w-full overflow-hidden bg-white aspect-container">
                <div className="w-full h-full" style={{ overflow: 'hidden' }}>
                  <img
                    src="https://cdn.mrkhub.com/dochub-frontend/103/images/_pages/old-main/pictures/editor/integrations.png"
                    alt="Example"
                    style={imageStyle}
                  />
                </div>
              </div>
            </div>
            <div className="text-container mt-6">
              <p className="mt-8 text-xl" style={textContainerStyle}>
                <p className="mt-60 text-2xl" style={textContainerStyle}>
                Google and Dropbox integrations
                </p>
                <br />
                Gmail, Google Drive and Dropbox are seamlessly integrated into DocHub. You 
                can open and import files to DocHub straight from your Gmail inbox or Google Drive.
                 Once you've made your edits, export the file directly to Drive or import your Google 
                 Address Book and email the document to your contacts.             
                  </p>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropBox;
