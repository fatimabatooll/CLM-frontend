import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firestore/firestore';
import axios from 'axios';

const Signed = () => {
  const signerEmail = localStorage.getItem('signer_email');
  const envelopeId = localStorage.getItem('envelope_id');

  const checkSigning = async () => {
    const reqUrl = `${process.env.REACT_APP_API_URL}/file/get-status/?envelope_id=${envelopeId}&signer_email=${signerEmail}`;
    const response = await axios.get(reqUrl);
    return response.data;
  };

  const getDataFromFirebase = async () => {
    const q = query(collection(firestore, 'sendData'), where('envelope_id', '==', envelopeId));
    try {
      const querySnapshot = await getDocs(q);

      let documentId;
      const docsData = querySnapshot.docs.map((doc) => {
        documentId = doc.id;
        return doc.data();
      });

      let document = docsData[0];

      return { document, documentId };
    } catch (error) {
      console.error('Error fetching received documents:', error);
    }
  };

  const updateFirebaseDoc = async (data, id) => {
    const docRef = doc(firestore, 'sendData', id);
    await updateDoc(docRef, data);
  };

  const cleanupAndRedirect = () => {
    localStorage.removeItem('envelope_id');
    localStorage.removeItem('signer_email');
    window.top.location.href = '/receive-doc';
  };

  const apiCalls = async () => {
    const { document, documentId } = await getDataFromFirebase();

    const { addUserEmails } = document;
    const recipient = addUserEmails.find((obj) => obj.email === signerEmail);

    if (!recipient.documentSigned) {
      const { status } = await checkSigning();

      if (status === 'signed') {
        recipient.documentSigned = true;
        await updateFirebaseDoc(document, documentId);
      }
    }

    cleanupAndRedirect();
  };

  useEffect(() => {
    apiCalls();
  }, []);

  // Inline styles for better readability
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
      <h1 style={headingStyle}>Document has been signed!</h1>
      <h4 style={subheadingStyle}>You'll be redirected back to the app.</h4>
    </div>
  );
};

export default Signed;
