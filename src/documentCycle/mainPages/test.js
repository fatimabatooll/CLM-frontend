import React from 'react';
import emailjs from 'emailjs-com';

const EmailSender = () => {
  const sendEmail = () => {
    // Replace these values with your EmailJS service ID, template ID, and user ID
    const serviceId = 'service_jjzd7dn';
    const templateId = 'template_rz0q7sp';
    const userId = 'qw4I1NBEsOmRb3kZT';

    // You can set template parameters here, for example, name and message
    const templateParams = {
      to_name: 'Recipient Name',
      message: 'This is a sample email sent from a React app using EmailJS!',
    };

    // Send the email using EmailJS
    emailjs.send(serviceId, templateId, templateParams, userId)
      .then((response) => {
        console.log('Email sent successfully:', response);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  };

  return (
    <div>
      <h1>Email Sender</h1>
      <button onClick={sendEmail}>Send Email</button>
    </div>
  );
};

export default EmailSender;
