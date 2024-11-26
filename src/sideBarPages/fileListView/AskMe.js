import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { IoClose } from "react-icons/io5";
import { BsSendFill } from "react-icons/bs";

const AskMe = ({ setOpenAskMe }) => {
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
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/file/list/`
      );
      const files = response.data.file_list.map((file) => ({
        ...file,
        labels: [],
      }));
      const filteredFiles = files.filter(
        (file) => file.fields.account_id === user.id
      );
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
        console.log("Navigating to PDF view");
        navigate("/pdf-view", { state: { pdfUrl: url } });
      } else {
        console.log("Navigating to Word view");
        navigate("/word-view", { state: { otherUrl: url } });
      }
    } else {
      console.error("No valid download URL for the selected document.");
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
    try {
      const response = await fetch("http://13.232.247.43:8000/api/chat/search", {
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
      const data = await response.json();
      setResponseData(data);

      const fileNames = data.file_names || [];
      const matchedfiles = fileList.filter((file) =>
        fileNames.includes(file.fields.name)
      );

      const newLLMMessage = {
        id: messages.length + 1,
        text:
          matchedfiles.length > 0
            ? `I found the following documents based on your request:`
            : "No documents found.",
        sender: "llm",
        type: "response",
        matchedFiles: matchedfiles,
      };

      setMessages((prevMessages) => [...prevMessages, newLLMMessage]);
      setMatchedFiles(matchedfiles);
    } catch (error) {
      console.error("Error sending message:", error.message);
    } finally {
      setLlmIsTyping(false);
      setContent("");
    }
  };

  const handleCloseAskMe = () => {
    navigate("/file-list");
  };

  return (
    <div className="bg-white pb-1 pl-2 pr-2  rounded-xl w-full mx-auto">
      <div className="flex justify-between mt-3">
        <h1 className="text-xl font-bold">Search With Me</h1>
      </div>

      <div
        className="bg-white  mt-1 rounded-xl w-full overflow-hidden"
        style={{ height: "auto" }}
      >
        {" "}
        {messages.map((message) => {
          const isUserMessage = message.sender === "user";
          return (
            <div
              key={message.id}
              className={`p-2 ${isUserMessage ? "text-right" : "text-left"}`}
            >
              {message.type === "text" ? (
                <div className="inline-block px-4 py-2 rounded-lg bg-gray-200 mb-1 mt-2">
                  {message.text}
                </div>
              ) : (
                <div className="inline-block px-4 py-3 rounded-lg bg-purple-200 w-100  ">
                  {message.text}
                  {message.matchedFiles && message.matchedFiles.length > 0 && (
                    <div
                      style={{ border: "2px solid #6354b667" }}
                      className="w-full shadow-lg text-sm text-left dark:text-black-400 mt-3 sm:rounded-lg rounded-3xl overflow-hidden"
                    >
                      <table className="w-full">
                        <thead
                            style={{  color: "#6254B6" , backgroundColor: "rgb(228, 225, 250)" }}
                            class="text-base dark:text-white"
                            >
                          <tr style={{ backgroundColor: 'rgb(228, 225, 250)', borderRadius: "50px" }}>
                            <th
                              className="font-body text-left py-3 pl-4 pr-2"
                              style={{ width: "30%" }}
                            >
                              File Name
                            </th>
                            <th
                              className="font-body text-left py-3 pr-2"
                              style={{ width: "30%" }}
                            >
                              Owner
                            </th>
                            <th
                              className="font-body text-left py-3 pr-2"
                              style={{ width: "30%" }}
                            >
                              Folder
                            </th>
                            <th
                              className="font-body text-left py-3 pr-2"
                              style={{ width: "30%" }}
                            >
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody style={{ backgroundColor:'white'
                        }}>
                          {message.matchedFiles.map((file, i) => (
                            <tr key={file.pk} className="border-b">
                              <td className="py-3 px-2" style={{ width: "30%" }}>

                                <button
                                  onClick={() =>
                                    handleOpenDocument(file.fields.download_url)
                                  }
                                  className="text-black-600"
                                >
                                  {file.fields.name}
                                </button>
                              </td>
                              <td className="py-3 px-1" style={{ width: "30%" }}>
                                {user.first_name} {user.last_name}
                              </td>
                              <td className="py-3 px-1" style={{ width: "30%" }}>
                                {file.fields.folder
                                  ? file.fields.folder
                                  : "------"}
                              </td>
                              <td className="py-3 px-1" style={{ width: "30%" }}>
                                {file.fields.created_at
                                  ? format(
                                      new Date(file.fields.created_at),
                                      "dd MMMM yyyy"
                                    )
                                  : "------"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex mt-16 items-center space-x-2">
        <input
          type="text"
          placeholder="Please help me to find the keywords"
          className="flex-1  pt-2 pb-2 pl-3 bg-gray-200 rounded-full outline-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          className="bg-gray-700 p-2 text-white rounded-full hover:bg-black"
          onClick={handleSend}
        >
          <BsSendFill />
        </button>
      </div>
    </div>
  );
};

export default AskMe;