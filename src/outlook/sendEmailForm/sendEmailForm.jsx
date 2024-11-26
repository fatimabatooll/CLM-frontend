import React, { useState } from 'react';
import { Form, Input, Button, notification, Select, Tag } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Client } from '@microsoft/microsoft-graph-client';
const { TextArea } = Input;

const SendEmailForm = () => {
  const [form] = Form.useForm();
  const [recipients, setRecipients] = useState([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');


  const getNameFromEmail = email => email.substring(0, email.indexOf('@')) || email;

  const sendEmail = async () => {
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

    const sendMailPayload = {
      message: {
        subject: subject,
        body: {
          contentType: "HTML",
          content: body,
        },
        toRecipients: recipients.map(recipient => ({
          emailAddress: {
            address: recipient.email,
          },
        })),
      },
      saveToSentItems: "true",
    };

    try {
      await client.api('/me/sendMail')
        .version('v1.0')
        .post(sendMailPayload);
      console.log('Email sent successfully');
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };
  const handleSelectChange = (value, option) => {
    setRecipients(value.map(email => ({ email, name: getNameFromEmail(email) })));
  };

  return (
    <Form form={form} layout="vertical" onFinish={sendEmail} style={{marginLeft:'10%', marginTop:'40px'}}>
      <Form.Item
        label="Recipient Emails"
        name="recipients"
        rules={[{ required: true, message: 'Please input the recipient emails!' }]}
      >
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Add recipients"
          value={recipients.map(recipient => recipient.email)}
          onChange={handleSelectChange}
          tokenSeparators={[',']}
          tagRender={props => {
            const {  value, closable, onClose } = props;
            return (
              <Tag closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
                {getNameFromEmail(value)}
              </Tag>
            );
          }}
        />
      </Form.Item>
      <Form.Item
        label="Subject"
        name="subject"
        rules={[{ required: true, message: 'Please input the subject!' }]}
      >
        <Input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </Form.Item>
      <Form.Item
        label="Body"
        name="body"
        rules={[{ required: true, message: 'Please input the email body!' }]}
      >
        <TextArea
        autoSize={{ minRows: 20, maxRows: 20 }}
          style={{ width: '800px' }}

          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit"  style={{ marginRight: '10px', color:'blue' }}icon={<MailOutlined />}>
          Send Email
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SendEmailForm;
