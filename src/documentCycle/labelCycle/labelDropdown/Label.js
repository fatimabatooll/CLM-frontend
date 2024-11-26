import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Label = ({ onSelect }) => {
  const [tagName, setTagName] = useState("");
  const [tags, setTags] = useState([]);
  const [isDoubleDropdownOpen, setIsDoubleDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState({});

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [isLoadingTags, setIsLoadingTags] = useState(false);

  useEffect(() => {
    const obj = JSON.parse(localStorage.getItem("user"));
    if (
      obj &&
      (obj.first_name !== user.first_name || obj.last_name !== user.last_name)
    ) {
      setUser(obj);
    }
  }, [user]);
  const handleInputChange = (e) => {
    setTagName(e.target.value);
  };

  const toggleDoubleDropdown = () => {
    setIsDoubleDropdownOpen((prevOpen) => !prevOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevOpen) => !prevOpen);
  };

  const navigateToCreateTag = () => {
    navigate("/create-label");
  };
  const handleOptionSelect = (tag) => {
    setSelectedOption(tag.name);
    setIsDropdownOpen(false);
    console.log(tag.id);
    onSelect(tag.id);
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/file/get_tags/`
        );
        console.log("Fetched Tags:", response.data);

        console.log("Fetched tags:", response.data);

        const tagsArray = response.data.tags || [];
        const userId = user.id;

        const filteredTags = tagsArray.filter(tag => tag.account === userId)
        const reversedTags = filteredTags.slice().reverse();

        setTags(reversedTags);
      } catch (error) {
        console.error("Error fetching tags", error);
      }
    };
    fetchTags();
  }, [user.id]); 
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setIsDoubleDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div className="sm:col-span-2 relative" ref={dropdownRef}>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={selectedOption}
          readOnly
          placeholder="Select or Create Label"

          className="border-2 border-gray-300 px-3 py-[11px] rounded-md w-full  focus:outline-none"
          onClick={toggleDropdown}

        />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-4 h-4 "
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            right: "5px",
          }}
          onClick={toggleDropdown}

        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>


      {isDropdownOpen && (
        <div className="z-10 absolute mt-2">
          <div
            id="multi-dropdown"
            className="bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
          >
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="multiLevelDropdownButton"
            >
              <li>
                <button
                  onClick={navigateToCreateTag}
                  style={{ color: "black" }}
                  className="block px-4 py-2 dark:text-black transition duration-300 ease-in-out hover:bg-gray-100 hover:text-gray-800"
                >
                  Create & Edit Label
                </button>
              </li>
              <li>
                <button
                  id="doubleDropdownButton"
                  style={{ color: "black" }}
                  className="flex items-center justify-between w-full px-4 py-2 dark:text-black transition duration-300 ease-in-out hover:bg-gray-100 hover:text-gray-800"
                  type="button"
                  onClick={toggleDoubleDropdown}
                >
                  Show All Labels
                </button>

                {isDoubleDropdownOpen && (
                  <div className="z-10 absolute left-44 mt-0">
                    <div className="bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                      <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="doubleDropdownButton"
                      >
                        {isLoadingTags ? (
                          <li>
                            <p className="px-4 py-2 text-gray-700">Loading...</p>
                          </li>
                        ) : tags.length === 0 ? (
                          <li>
                            <p className="px-4 py-2 text-gray-700">No tags found</p>
                          </li>
                        ) : (
                          tags.map((tag) => (
                            <li key={tag.id}>
                              <button
                                onClick={() => {
                                  setIsDoubleDropdownOpen(false);
                                  toggleDropdown();
                                  setSelectedOption(tag.name);
                                  if (typeof onSelect === "function") {
                                    onSelect(tag.name);
                                  }
                                }}
                                style={{ color: "black" }}
                                className="flex items-center justify-between w-full px-4 py-2 dark:text-black transition duration-300 ease-in-out hover:bg-gray-100 hover:text-gray-800"
                              >
                                {tag.name}
                              </button>

                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Label;