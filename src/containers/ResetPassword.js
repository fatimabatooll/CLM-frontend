import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import axios from "axios";

import { connect } from "react-redux";
import { reset_password } from "../actions/auth";
const ResetPassword = ({ reset_password }) => {
  const [requestSent, setRequestSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });
  const [emailError, setEmailError] = useState("");
  const { email } = formData;
 


  const onChange = (e) =>
  setFormData({ ...formData, [e.target.name]: e.target.value });

const onSubmit = async (e) => {
  e.preventDefault();
  setLoading(true); 
  setEmailError(""); 

  try {

    const emailCheckRes = await axios.get(
      `${process.env.REACT_APP_API_URL}/file/check-email/?email=${email}`
    );

    if (emailCheckRes.data === "Email Not exists!") {
      setEmailError("The provided email does not exist.");
       // Set error message
      setLoading(false);
      return; // Stop further execution
    }
    console.log("Email Exists");

    await reset_password(email);
    setFormData({ email: "" });
    setRequestSent(true);
    } catch (err) {
      console.error("Error checking email:", err);
      // Handle error if necessary
    } finally {
      setLoading(false);
    }
};
  return (
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-purple-700">
          Reset Password
        </h2>
      </div>
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="mb-4">
            {/* <label for="Email" class="block text-sm font-medium leading-6 text-gray-900">Email</label> */}
            <div class="mt-2">
              <input
                className="border-2 border-gray-200 p-2 rounded-md w-full focus:border-sky-700 focus:outline-none"
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => onChange(e)}
                required
              />
            </div>
            {emailError && (
              <p style={{color: "red"}}>{emailError}</p> 
            )}

          </div>
          <button
            type="submit"
            class="text-white focus:ring-4 w-full focus:outline-none focus:ring-sky-300 dark:focus:ring-sky-800 shadow-lg shadow-sky-500/50 dark:shadow-lg dark:shadow-sky-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 font-body"
            style={{ backgroundColor: "#6254B6" }}
            disabled= {loading}
          >
            {loading ? "Loading..." : "Send me reset password instructions"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default connect(null, { reset_password })(ResetPassword);