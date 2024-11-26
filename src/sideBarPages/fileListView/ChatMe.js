import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { IoClose } from "react-icons/io5";
import { BsSendFill } from "react-icons/bs";
const ChatMe = ({ setOpenAskMe }) => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [fileList, setFileList] = useState([]);
  const [user, setUser] = useState({});
  const [matchedFiles, setMatchedFiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [llmIsTyping, setLlmIsTyping] = useState(false);
  const [responseData, setResponseData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchData();
    const obj = JSON.parse(localStorage.getItem("user"));
    if (obj) {
      setUser(obj);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [user]);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/file/list/`);
      const files = response.data.file_list.map((file) => ({
        ...file,
        labels: [],
      }));
      const filteredFiles = files.filter((file) => file.fields.account_id === user.id);
      setFileList(filteredFiles);
    } catch (error) {
      console.error("Error fetching file list", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [user]);
  useEffect(() => {
    console.log(fileList);
  }, [fileList]);
  const handleOpenDocument = (url) => {
    if (url) {
      console.log("URL: ", url);
      if (url.includes(".pdf")) {
        navigate("/pdf-view", { state: { pdfUrl: url } });
      } else {
        navigate("/word-view", { state: { otherUrl: url } });
      }
    } else {
      console.error("No valid download URL for the selected document.");
    }
  };
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };
  const handleSend = async () => {
    const newUserMessage = {
      id: messages.length,
      text: content,
      sender: "user",
      type: "text",
    };
    setMessages([...messages, newUserMessage]);
    setLlmIsTyping(true);
    setContent("");
    try {
      const response = await fetch(`${process.env.REACT_APP_LLM}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: content }],
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      // Read the response stream
      const reader = response.body.getReader();
      let responseText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        responseText += new TextDecoder("utf-8").decode(value);
      }
      const messageText = responseText || "No response received";
      const newLLMMessage = {
        id: messages.length + 1,
        text: messageText,
        sender: "llm",
        type: "response",
      };
      setMessages((prevMessages) => [...prevMessages, newLLMMessage]);
    } catch (error) {
      console.error("Error sending message:", error.message);
    } finally {
      setLlmIsTyping(false);
      setContent(""); // Clear the input field
    }
  };
  const handleCloseAskMe = () => {
    navigate("/file-list");
  };
  return (
    <div className="bg-white pb-1 pl-2 rounded-xl w-full mx-auto">
      <div className="flex justify-between mt-3 ml-3">
        <h1 className="text-xl font-bold">Ask Me</h1>
      </div>
      <div className="bg-white mt-1 rounded-xl w-full resize-none overflow-y-auto scrollbar-webkit max-h-[400px]" style={{ height: "auto" }} >
        {messages.map((message) => {
          const isUserMessage = message.sender === "user";
          return (
            <div key={message.id} className={`p-2 ${isUserMessage ? "text-right" : "text-left"} mx-3`}>
              {message.type === "text" ? (
                <div className="inline-block px-4 py-2 rounded-lg bg-gray-200 mb-1 mt-2 ">
                  {message.text}
                </div>
              ) : (
                <div className="inline-block px-4 py-3 rounded-lg bg-purple-200 w-100 ">
                  {message.text}
                </div>
              )}
            </div>
          );
        })}
        {llmIsTyping && <div className="text-left p-2 rounded-lg bg-purple-200 w-20 ml-5">Typing...</div>}
      </div>
      <div className="flex mt-8 mb-2 items-center space-x-2 mx-3">
        <input
          type="text"
          placeholder="Please help me to find the keywords"
          className="flex-1 pt-2 pb-2 pl-3 bg-gray-200 rounded-full outline-none"
          onKeyDown={handleEnter}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="bg-gray-700 p-2 text-white rounded-full hover:bg-black" onClick={handleSend}>
          <BsSendFill />
        </button>
      </div>
    </div>
  );
};
export default ChatMe;