import React from 'react';

const DropBox2 = () => {
  const containerStyle = {
    backgroundColor: '#9975e7',
    color: '#fff',
    width: '100%',
    height: '800px',
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
            <div className="text-container">
              <p className="mt-6 text-xl" style={textContainerStyle}>
                <p className="mt-80 text-2xl" style={textContainerStyle}>
                  Reorder, rotate, and merge PDFs
                </p>
                <br />
                The Page Manager displays thumbnails of each page in your document, allowing you to rotate, delete, or reorder pages using drag and drop. Easily merge PDFs or other documents together with a simple click.
              </p>
            </div>

            <div className="group relative">
              <div className="relative h-90 mt-40 w-full overflow-hidden bg-white aspect-container">
                <div className="w-full h-full" style={{ overflow: 'hidden' }}>
                  <img
                    src="https://cdn.mrkhub.com/dochub-frontend/103/images/_pages/old-main/pictures/editor/phone.png"
                    alt="Example"
                    style={imageStyle}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropBox2;
