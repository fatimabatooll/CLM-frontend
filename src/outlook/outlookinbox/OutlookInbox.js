import React, { useState, useEffect } from 'react';
import { Providers, ProviderState } from '@microsoft/mgt-element';
import DOMPurify from 'dompurify';
import { List, Button, Layout, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Card, Typography } from 'antd';
import { Login } from '@microsoft/mgt-react';
import SendEmailForm from '../sendEmailForm/sendEmailForm';
import Search from '../emailSearch/EmailSearch'
const { Header, Content } = Layout;
const { Text, Title } = Typography;

const OutlookInbox = () => {
  const [emails, setEmails] = useState([]);
  const [activeEmailIndex, setActiveEmailIndex] = useState(null);
  const [showSendEmail, setShowSendEmail] = useState(false);

  const isProviderInitialized = Providers.globalProvider?.state === ProviderState.SignedIn;
  const handleSearchResults = (results) => {
    setEmails(results);
};
  useEffect(() => {
    if (isProviderInitialized) {
      Providers.globalProvider.graph.client
        .api('/me/messages')
        .version('v1.0')
        .select('subject,from,bodyPreview,body,subject, toRecipients')
        .top(100)
        .get()
        .then((response) => {
          setEmails(response.value);
        })
        .catch((error) => console.error(error));
    }
  }, [isProviderInitialized]);

  if (!isProviderInitialized) {
    return <div>Please sign in to view your emails.</div>;
  }

  const createMarkup = (htmlContent) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };

  const truncate = (str, num) => {
    return str?.length > num ? str.substr(0, num - 1) + "..." : str;
  };

  return (
    <Layout className="layout" style={{ minHeight: '100vh', overflow: 'hidden' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
        <Button type="primary" onClick={() => setShowSendEmail(true)} style={{ marginRight: '10px' }}>
          New Email
        </Button>
        <div style={{marginRight:'55%'}}>
        <Search onSearchResults={handleSearchResults}  />

        </div>
        <div>
          <div className="logo" style={{ color: 'rgba(0, 0, 0, 0.65)', fontWeight: 'bold' }}>
            <Login />
          </div>
        </div>
      </Header>
      <Content style={{ padding: '24px', backgroundColor: 'white' }}>
        <div className="email-client">
        <List
            className='email-list'
            itemLayout="horizontal"
            dataSource={emails}
            renderItem={(email, index) => (
              <List.Item
                key={index}
                onClick={() => {
                  setShowSendEmail(false);
                  setActiveEmailIndex(index);
                }}
                style={{ padding: '10px', borderRadius: '8px', margin: '10px 0' }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      style={{ backgroundColor: 'cadetblue' }} 
                      icon={<UserOutlined />} 
                    />
                  }
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <span style={{ color: 'black' }}>{email.from?.emailAddress?.name}</span>
                      <span style={{ color: 'grey' }}>{email.receivedDateTime}</span>
                    </div>
                  }
                  description={
                    <div>
                      <h4 style={{ color: 'blue', marginBottom: '0.5em' }}>{email.subject}</h4>
                      <p style={{ color: 'black' }}>{truncate(email.bodyPreview, 100)}</p>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
          {showSendEmail ? (
            <SendEmailForm />
          ) : activeEmailIndex !== null && (
            <Card 
              bordered={false} 
              style={{ marginTop: 24, overflow: 'hidden', width:'70%' }}
            >
              <Title level={4}>{emails[activeEmailIndex].subject}</Title>
              <Text strong>{emails[activeEmailIndex].from?.emailAddress?.name}</Text>
              <div style={{ margin: '16px 0' }}>
                <Text strong>To:</Text>
                {emails[activeEmailIndex].toRecipients.map((recipient, index) => (
                  <Text key={index} block>{recipient.emailAddress.name}</Text>
                ))}
              </div>
              <div 
                style={{ 
                  height: '750px', 
                  overflow: 'auto',
                  padding: '10px',
                  border: '1px solid #f0f0f0', 
                  margin: '10px 0',
                }}
                dangerouslySetInnerHTML={createMarkup(emails[activeEmailIndex].body.content)} 
              />
            </Card>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default OutlookInbox;
