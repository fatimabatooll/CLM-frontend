import React, { useState, useEffect } from "react";
import { Client } from "@microsoft/microsoft-graph-client";
import { Layout, Spin, Avatar } from "antd";
import DOMPurify from "dompurify";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import EmailSearch from "../../outlook/emailSearch/EmailSearch";
import { UserOutlined } from "@ant-design/icons";
import CircularProgress from "@mui/material/CircularProgress";
import { IoLogoMicrosoft } from "react-icons/io5";

import "./outlookEmail.css";

const { Content } = Layout;

const OutlookEmails = () => {
  const [emails, setEmails] = useState([]);
  const [activeEmailIndex, setActiveEmailIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOutlookAuthenticated, setIsOutlookAuthenticated] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { instance } = useMsal();
  useEffect(() => {
    fetchEmails();
  }, []);
  const emailsToDisplay = searchResults.length > 0 ? searchResults : emails;

  const fetchEmails = async () => {
    try {
      const cachedEmails = await fetchCachedEmailsFromBackend();
      if (cachedEmails && cachedEmails.length > 0) {
        setEmails(cachedEmails);
        setIsOutlookAuthenticated(true);
        setLoading(false);
        return;
      }
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        throw new Error("Access token not found");
      }
      const client = Client.init({
        authProvider: (done) => {
          done(null, accessToken);
        },
      });
      const response = await client
        .api("/me/messages")
        .version("v1.0")
        .select("subject,from,bodyPreview,body,subject,toRecipients")
        .top(100)
        .get();
      const fetchedEmails = response.value;
      setEmails(fetchedEmails);
      setIsOutlookAuthenticated(true);
      setLoading(false);
      // Update cache with fetched emails
      sendEmailsToBackend(fetchedEmails);
    } catch (error) {
      console.error("Error fetching emails:", error);
      setError("Failed to fetch emails. Please try again.");
      setIsOutlookAuthenticated(false);
      setLoading(false);
    }
  };

  const fetchCachedEmailsFromBackend = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/file/get_emails/`);
      if (!response.ok) {
        throw new Error("Failed to fetch emails from backend");
      }
      const data = await response.json();
      const parsedEmails = JSON.parse(data.emails);
      console.log("Cached emails:", parsedEmails.emails);
      return parsedEmails.emails;
    } catch (error) {
      console.error("Error fetching emails:", error);
      return [];
    }
  };

  const sendEmailsToBackend = async (emails) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/file/set_emails/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emails }),
      });
      if (!response.ok) {
        throw new Error("Failed to send emails to backend for caching");
      }
      // Since we successfully updated cache, we don't need to do anything here
    } catch (error) {
      console.error("Error sending emails to backend:", error);
    }
  };
  const signInWithOutlook = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);
      if (response.accessToken) {
        localStorage.setItem("access", response.accessToken);
        setIsOutlookAuthenticated(true);
        setLoading(true);
        fetchEmails();
      } else {
        console.error("Failed to obtain access token from Outlook.");
      }
    } catch (error) {
      console.error("Error during Outlook sign-in:", error);
      setError("Failed to sign in with Outlook. Please try again.");
    }
  };
  const createMarkup = (htmlContent) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };
  const truncate = (str, num) => {
    return str?.length > num ? str.substr(0, num - 1) + "..." : str;
  };
  if (loading) {
    return (
      <div
        className="loader"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "#6254B6" }} />
      </div>
    );
  }
  if (!isOutlookAuthenticated) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ width: "100%" }}
      >
        <div className=" p-24 email-background">
          <button
            onClick={signInWithOutlook}
            className="email-button flex justify-center items-center gap-2 w-full text-white focus:ring-4 focus:outline-none focus:ring-sky-300 dark:focus:ring-sky-800 shadow-md shadow-black-500/50 dark:shadow-lg dark:shadow-sky-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center  font-body"
            style={{ backgroundColor: "#6254B6" }}
          >
            <IoLogoMicrosoft className="w-6 h-6" style={{ color: "white" }} />
            Sign In for Outlook Emails
          </button>
        </div>
      </div>
    );
  }
  return (
    <Layout
      className="layout"
      style={{ marginTop: "20px", overflow: "hidden" }}
    >
      <Content style={{ padding: "2px", backgroundColor: "white" }}>
        <EmailSearch onSearchResults={(results) => setSearchResults(results)} />
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            <div className="email-client">
              <div className="mt-2  email-list">
                {emailsToDisplay.map((email, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveEmailIndex(index)}
                    className="py-2.5 rounded-lg my-2.5 cursor-pointer"
                  >
                    <div className="flex ml-2">
                      <div className=" rounded-full mb-2">
                        <Avatar
                          style={{ backgroundColor: "#6254B6" }}
                          icon={<UserOutlined />}
                        />
                      </div>
                      <div className="flex justify-between items-center w-full text-sm ml-3">
                        <span className="text-black text-lg">
                          {email.from?.emailAddress?.name}
                        </span>
                        <span className="text-gray-500 ml-4">
                          {email.receivedDateTime}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4
                        className="mb-2 text-sm ml-4"
                        style={{ color: "#6254B6" }}
                      >
                        {email.subject}
                      </h4>
                      <p className="text-gray-500 text-sm ml-4">
                        {truncate(email.bodyPreview, 100)}
                      </p>
                    </div>
                    <hr className="mt-2 line-gap" />
                  </div>
                ))}
              </div>
              {activeEmailIndex !== null && (
                <div
                  className="ml-16 mt-6 overflow-hidden w-3/5 email-received"
                  style={{ border: "none" }}
                >
                  <h1 className="text-3xl">
                    {emailsToDisplay[activeEmailIndex].subject}
                  </h1>
                  <span
                    className="text-lg"
                    style={{ color: "#6254B6", marginTop: "2px" }}
                  >
                    {emailsToDisplay[activeEmailIndex].from?.emailAddress?.name}
                  </span>
                  <div className="mt-4">
                    <strong>To:</strong>
                    {emailsToDisplay[activeEmailIndex].toRecipients.map(
                      (recipient, index) => (
                        <span key={index}>{recipient.emailAddress.name}</span>
                      )
                    )}
                  </div>
                  <div
                    className="overflow-auto mt-4 p-2 border border-gray-200"
                    style={{ height: "calc(100% - 20px)" }}
                  >
                    <div
                      dangerouslySetInnerHTML={createMarkup(
                        emailsToDisplay[activeEmailIndex].body.content
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </Content>
    </Layout>
  );
};
export default OutlookEmails;