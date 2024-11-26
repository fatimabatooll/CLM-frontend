import React, { useEffect, useState } from 'react'
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { firestore } from '../../firestore/firestore';
import axios from 'axios';
import emailjs from "emailjs-com";
import { toast } from 'sonner'

const AfterSigning = () => {

  const signerEmail = localStorage.getItem('signer_email')
  const envelopeId = localStorage.getItem('envelope_id')
  const [user, setUser] = useState({});

  const checkSigning = async () => {

    const reqUrl = `${process.env.REACT_APP_API_URL}/file/get-status/?envelope_id=${envelopeId}&signer_email=${signerEmail}`

    const response = await axios.get(reqUrl);
    return response.data
  }
  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      const obj = JSON.parse(localStorage.getItem('user'));
      if (obj) {
        setUser(obj);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Call apiCalls and sendEmail when the user state is set
    if (user && user.first_name && user.email) {
      apiCalls();
      sendEmail();
      toast.success("Document has been signed successfully")
    }
  }, [user]); 

  const getDataFromFirebase = async () => {
    const q = query(
      collection(firestore, "sendData"),
      where("envelope_id", "==", envelopeId)
    );
  
    try {
      const querySnapshot = await getDocs(q);
  
      let documentId;
      const docsData = querySnapshot.docs.map((doc) => {
        documentId = doc.id;
        return doc.data();
      });
  
      let document = docsData[0];
  
      const { addUserEmails } = document;
      const recipient = addUserEmails.find(
        (obj) => obj.email === signerEmail
      );
  
      const senderEmail = document.senderemail;
  
      // Fetch the "name" property from the recipient object
      const recipientWithName = {
        ...recipient,
        name: recipient.name || '', // Use an empty string if "name" is not available
      };
  
      return { document, documentId, senderEmail, recipient: recipientWithName };
    } catch (error) {
      console.error("Error fetching received documents:", error);
    }
  };
  
  

  const updateFirebaseDoc = async (data, id) => {
    const docRef = doc(firestore, 'sendData', id);
    await updateDoc(docRef, data);
  }

  const cleanupAndRedirect = () => {

    localStorage.removeItem('envelope_id');
    localStorage.removeItem('signer_email');

    window.top.location.href = '/inbox'
  }
  const EMAILJS_USER_ID = "qw4I1NBEsOmRb3kZT";
  const EMAILJS_SERVICE_ID = "service_jjzd7dn";
  const EMAILJS_TEMPLATE_ID = "template_1uarpfq";
  emailjs.init(EMAILJS_USER_ID);
  const sendEmail = async () => {
    const { document, documentId, senderEmail, recipient, recipientWithName } = await getDataFromFirebase();
  
    // Check if user state is available and not undefined
    if (user && user.first_name && user.email) {
      const templateParams = {
        to_email: senderEmail,
        from_name: user.first_name,
        from_email: user.email,
        to_name: recipientWithName

      };
      console.log(templateParams);
  
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_USER_ID)
        .then(function(response) {
          console.log('SUCCESS!', response.status, response.text);
        })
        .catch(function(error) {
          console.log('FAILED...', error);
        });
    } else {
      console.log('User data is not available or incomplete.');
    }
  };
  

  const apiCalls = async () => {
    const {document, documentId} = await getDataFromFirebase()

    const { addUserEmails } = document

    const recipient = addUserEmails.find(obj => obj.email === signerEmail);

    if (!recipient.documentSigned) {

      const { status, signed_time } = await checkSigning()
      
      if (status === 'signed') {
        recipient.documentSigned = true
        recipient.signed_time = signed_time

        await updateFirebaseDoc(document, documentId)
      }
    }

    cleanupAndRedirect()    
  }
  
  useEffect(() => {

    apiCalls()
    sendEmail()
    
  }, [])

  const containerStyle = {
    textAlign: 'center',
    marginTop: '50px',
  };

  const headingStyle = {
    fontSize: '24px',
    marginBottom: '16px',
  };

  const subheadingStyle = {
    fontSize: '18px',
    marginBottom: '32px',
  };


  return (
    <div style={containerStyle}>
        {/* <h1 style={headingStyle}>Thanks for signing the document!</h1>
        <h4 style={subheadingStyle}>You'll be redirected back to the app.</h4> */}
    </div>
  )
}
export default AfterSigning