import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const DocuSignComponent = () => {

  const { state: docusignUrl } = useLocation()

  const loadDocuSign = () => {
    window.DocuSign.loadDocuSign('f59464e0-2bf4-43c3-af7d-d33a53276f7f').then((docusign) => {
      const signing = docusign.signing({
        url: docusignUrl,
        displayFormat: 'focused',
        style: {
          branding: {
            primaryButton: {
              backgroundColor: '#333',
              color: '#fff',
              border: '1px solid #333', /* Add a border to the primary button */
              borderRadius: '5px', /* Add border radius to the button */
            }
          },
          signingNavigationButton: {
            finishText: 'You have finished the document! Hooray!',
            position: 'bottom-center',
            backgroundColor: '#fff', /* Set background color for navigation button */
            color: '#333', /* Set text color for navigation button */
            border: '1px solid #333', /* Add a border to the navigation button */
            borderRadius: '5px', /* Add border radius to the button */
            padding: '10px', /* Add padding to the button */
          }
        }
      });
      signing.on('ready', (event) => {
        console.log('UI is rendered');
      });
      signing.on('sessionEnd', (event) => {
        console.log('sessionend', event);
      });
      signing.mount('#agreement');
    }).catch((ex) => {
      console.error('DocuSign configuration error:', ex);
    });
  }

  useEffect(() => {
    loadDocuSign()
  }, [])

  return (
    <div className="docusign-agreement" id="agreement"></div>
  )
}

export default DocuSignComponent