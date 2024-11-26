import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { login, outlookSignUp } from "../actions/auth";
import axios from "axios";
import Header from "../pages/Home/components/Header";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CircularProgress from "@mui/material/CircularProgress";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { Toaster, toast } from "sonner";
import WindowIcon from "@mui/icons-material/Window";
import "../containers/Login.css";
import loginlogo from "../../src/images/logo.svg";
import group from "../images/Group.png";


const Login = ({ login, outlookSignUp, isAuthenticated, error }) => {
  const { instance } = useMsal();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [microsoftLoading, setMicrosoftLoading] = useState(false); // For Microsoft login button

  const navigate = useNavigate();
  const { email, password } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
      // window.location.reload();

    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleOutlookLogin = async () => {
    setMicrosoftLoading(true); // Start loading

    try {
      const response = await instance.loginPopup(loginRequest);
      console.log("Complete login response:", response);

      if (response.accessToken) {
        localStorage.setItem("access", response.accessToken);
        const accessToken = localStorage.getItem("access");

        const userResponse = await fetch(
          "https://graph.microsoft.com/v1.0/me",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const userData = await userResponse.json();
        const {
          mail: email,
          givenName: first_name,
          surname: last_name,
        } = userData;

        if (!email || !first_name) {
          console.error("Required user information is missing.");
          return;
        }

        try {
          const signupResponse = await axios.post(
            `${process.env.REACT_APP_API_URL}/file/signup/`,
            {
              email,
              first_name,
              last_name,
            }
          );
          console.log(
            "Sign-up successful, proceeding to sign-in:",
            signupResponse.data
          );
        } catch (signupError) {
          console.error(
            "Error during sign-up, user might already exist or other issue:",
            signupError.response.data
          );
        }

        const backendResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/file/outlook/`,
          {
            email,
            first_name,
            last_name,
          }
        );

        console.log("Backend response:", backendResponse.data);
        localStorage.setItem("user", JSON.stringify(backendResponse.data.user));
        localStorage.setItem("authToken", backendResponse.data.token);

        navigate("/dashboard");
        // window.location.reload();

      } else {
        console.error("Access token is undefined.");
      }
    } catch (error) {
      console.error("Error during login or user creation:", error);
    } finally {
      setMicrosoftLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  return (
    <>
      {/* <Header /> */}
      <div className=" main-login grid grid-cols-2">
        <div className="ml-8 px-4 py-0 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm"></div>
          <div className="main-form items-center	 ">
            <div className="form-img-main py-8">
              <img src={loginlogo} alt="" />
            </div>
            <form
              onSubmit={(e) => onSubmit(e)}
              action="# "
              className="space-y-6 login-form"
            >
              <h2 className="main-heading-login  text-center leading-9  text-sky-900">
                Login{" "}
              </h2>
              <h1 className="text-center login-heading mt-2 ">
                Please enter your login information
              </h1>
              <div className="">
                <label
                  htmlFor="email"
                  className=" block text-md font-light leading-6 text-gray-900 font-body mb-2"
                >
                  Email address
                </label>
                <div className="">
                  <input
                    required
                    type="email"
                    className="border-2 border-gray-200 p-2 rounded-md w-full focus:border-sky-700 focus:outline-none"
                    placeholder=""
                    name="email"
                    value={email}
                    onChange={(e) => onChange(e)}
                  />
                </div>
              </div>
              <div className="">
                <label
                  htmlFor="password"
                  className="block text-md font-light leading-6 text-gray-900 font-body "
                >
                  Password
                </label>
                <div className=" relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    className="border-2 border-gray-200 p-2 pr-10 rounded-md w-full focus:border-sky-700 focus:outline-none"
                    placeholder=""
                    name="password"
                    value={password}
                    onChange={(e) => onChange(e)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-2 text-sky-700 hover:text-sky-800 focus:outline-none"
                  >
                    {showPassword ? (
                      <VisibilityIcon
                        style={{ color: "#6254B6", fontSize: "24px" }}
                      />
                    ) : (
                      <VisibilityOffIcon
                        style={{ color: "#6254B6", fontSize: "24px" }}
                      />
                    )}
                  </button>
                </div>
                <div className="text-sm mt-1">
                  <Link
                    to="/reset-password"
                    className="text-md font-medium  hover:text-sky-800"
                    style={{ color: "#6254B6" }}
                  >
                    Forgot your Password?
                  </Link>
                </div>
              </div>
              <button
                type="submit"
                className="submit-login  text-white focus:ring-4 w-full focus:outline-none focus:ring-sky-300 dark:focus:ring-sky-800 shadow-md shadow-black-500/50 dark:shadow-lg dark:shadow-sky-800/80 font-medium rounded-lg text-md px-1 py-3 text-center me-2 font-body"
                style={{ backgroundColor: "#6254B6" }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Login"
                )}
              </button>
              <button
              onClick={handleOutlookLogin}
              className="flex justify-center items-center gap-2 w-full text-black focus:ring-4 focus:outline-none focus:ring-sky-300 dark:focus:ring-sky-800 shadow-md shadow-black-500/50 dark:shadow-lg dark:shadow-sky-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center  font-body"
              disabled={microsoftLoading} // Disable button when loading
            >
              {microsoftLoading ? ( // If loading, show spinner
                <CircularProgress size={20} color="inherit" />
              ) : ( // Otherwise, show button content
                <>
                  <WindowIcon className="w-6 h-6" />
                  Login From Microsoft
                </>
              )}
            </button>
              <div className="flex flex-col items-center">
                <p className="text-center">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-sky-700 hover:text-sky-800"
                    style={{ color: "#6254B6" }}
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
        <div>
          <div className="docvault">
            <img className="docimg" src={group} alt="" />
          </div>
        </div>
      </div>
    </>
  );
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.auth.error,
});
export default connect(mapStateToProps, { login, outlookSignUp })(Login);
