import axios from "axios";
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED_SUCCESS,
  USER_LOADED_FAIL,
  AUTHENTICATED_SUCCESS,
  AUTHENTICATED_FAIL,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_FAIL,
  PASSWORD_RESET_CONFIRM_SUCCESS,
  PASSWORD_RESET_CONFIRM_FAIL,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  ACTIVATION_SUCCESS,
  ACTIVATION_FAIL,
  GOOGLE_AUTH_SUCCESS,
  GOOGLE_AUTH_FAIL,
  LOGOUT,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  OUTLOOK_AUTH_SUCCESS,
  OUTLOOK_AUTH_FAIL,
} from "./types";
import { toast } from "sonner";

export const load_user = () => async (dispatch) => {
  const token = localStorage.getItem("access");
  console.log("Retrieved token:", token); 
    
  if (token) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${localStorage.getItem("access")}`,
        "Accept": "application/json",
      },
    };
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/users/me/`, config);
      dispatch({
        type: USER_LOADED_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({ type: USER_LOADED_FAIL });
    }
  } else {
    dispatch({ type: USER_LOADED_FAIL });
  }
};


export const outlookSignUp = (email, first_name, last_name) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ email, first_name, last_name });

  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/file/signup/`,
      body,
      config
    );

    console.log(res); 

    dispatch({
      type: OUTLOOK_AUTH_SUCCESS,
      payload: res.data,
    });

  } catch (err) {
    dispatch({
      type: OUTLOOK_AUTH_FAIL,
    });
    console.error('Outlook Login Failed:', err);
  }
};

export const googleAuthenticate = (state, code) => async (dispatch) => {
  if (state && code && !localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    const details = {
      state: state,
      code: code,
    };
    const formBody = Object.keys(details)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
      )
      .join("&");
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/o/google-oauth2/?${formBody}`,
        config
      );
      dispatch({
        type: GOOGLE_AUTH_SUCCESS,
        payload: res.data,
      });
      dispatch(load_user());
    } catch (err) {
      dispatch({
        type: GOOGLE_AUTH_FAIL,
      });
    }
  }
};
export const checkAuthenticated = () => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    const body = JSON.stringify({ token: localStorage.getItem("access") });
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/jwt/verify/`,
        body,
        config
      );
      if (res.data.code !== "token_not_valid") {
        dispatch({
          type: AUTHENTICATED_SUCCESS,
        });
      } else {
        dispatch({
          type: AUTHENTICATED_FAIL,
        });
      }
    } catch (err) {
      dispatch({
        type: AUTHENTICATED_FAIL,
      });
    }
  } else {
    dispatch({
      type: AUTHENTICATED_FAIL,
    });
  }
};

export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ email, password });
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/jwt/create/`,
      body,
      config
    );
    // Fetch the user data from the server
    const userResponse = await axios.get(
      `${process.env.REACT_APP_API_URL}/auth/users/me/`,
      {
        headers: {
          Authorization: `JWT ${res.data.access}`,
          Accept: "application/json",
        },
      }
    );
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    // Save user data in local storage
    localStorage.setItem("user", JSON.stringify(userResponse.data));
    localStorage.setItem("access", res.data.access);
    dispatch(load_user());
  } catch (err) {
    if (err.response && err.response.data && err.response.data.detail) {
      // Server provided a detailed error message
      const errorDetail = err.response.data.detail;
      console.error("Login error detail:", errorDetail);

      // Check if the error detail indicates incorrect credentials
      if (errorDetail.toLowerCase().includes("no active account found")) {
        dispatch({
          type: LOGIN_FAIL,
          payload: "Incorrect email or password. Please try again.",
        });
        toast.error("Incorrect email or password. Please try again.");
      } else {
        console.error("Login error:", errorDetail);
        dispatch({
          type: LOGIN_FAIL,
          payload: errorDetail,
        });
      }
    } else {
      // Generic error handling
      console.error("Login error:", err.message);
      dispatch({
        type: LOGIN_FAIL,
        payload: "An error occurred during login.",
      });
    }
  }
};

export const updateProfile = (userData) => async (dispatch) => {
  const access = localStorage.getItem("access");
  if (!access) {
    console.error("Access token not found in localStorage");
    return; // Handle this case or return early
  }
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${localStorage.getItem("access")}`, // Add the JWT token for authorization
    },
  };
  const body = JSON.stringify(userData);
  // console.log('Authorization Header:', config.headers.Authorization);
  // console.log('Request Body:', body);
  // console.log('Request URL:', `${process.env.REACT_APP_API_URL}/auth/users/me/`);
  try {
    const res = await axios.patch(
      `${process.env.REACT_APP_API_URL}/auth/users/me/`,
      body,
      config
    );
    dispatch({
      type: UPDATE_PROFILE_SUCCESS,
      payload: res.data,
    });
    // Update the user data in local storage with the updated data
    // Print the access token in the console
  } catch (err) {
    dispatch({
      type: UPDATE_PROFILE_FAIL,
    });
  }
};
// Example Redux action for handling profile update failure
export const updateProfileFail = (error) => {
  return {
    type: UPDATE_PROFILE_FAIL,
    payload: error,
  };
};

export const signup = (first_name, last_name, email, password, re_password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const emailCheckRes = await axios.get(
      `${process.env.REACT_APP_API_URL}/file/check-email/?email=${email}`
    );

    if (emailCheckRes.data === "Email Not exists!") {
      // Email does not exist, proceed with password checks
      const passwordPattern =
        /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&?])(?!.*[;]).{8,32})/;
      
      if (!passwordPattern.test(password)) {
        const errorMessage =
          "Invalid password. Should contain at least one digit, one lowercase letter, one uppercase letter, one special character, and be 8-32 characters long.";
        dispatch({
          type: SIGNUP_FAIL,
          payload: errorMessage,
        });

        toast.error(errorMessage, {
          style: {
            width: "400px",
          },
        });

        console.error("Signup Error:", errorMessage);
        return;
      }

      if (password !== re_password) {
        const errorMessage = "Password and confirm password do not match.";
        dispatch({
          type: SIGNUP_FAIL,
          payload: errorMessage,
        });
        toast.error(errorMessage);
        console.log("Signup Error:", errorMessage);
        return;
      }

      if (
        password === first_name ||
        password === last_name ||
        re_password === first_name ||
        re_password === last_name
      ) {
        const errorMessage = "Please use a strong password.";
        dispatch({
          type: SIGNUP_FAIL,
          payload: errorMessage,
        });
        toast.error(errorMessage);
        console.error("Signup Error:", errorMessage);
        return;
      }

      // If all checks pass, proceed with signup
      const body = JSON.stringify({
        first_name,
        last_name,
        email,
        password,
        re_password,
      });

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/users/`,
          body,
          config
        );

        dispatch({
          type: SIGNUP_SUCCESS,
          payload: res.data,
        });

        console.log("Signup Success:", res.data);
        toast.success(
          "Signup successful! Please check your email for activation."
        );

        return true;
      } catch (signupErr) {
        const errorMessage = signupErr.response?.data?.password?.length
          ? signupErr.response.data.password[0]
          : "An error occurred during signup.";

        dispatch({
          type: SIGNUP_FAIL,
          payload: errorMessage,
        });
      }
    } else if (emailCheckRes.data === "Email exists") {
      const errorMessage =
        "Email already exists. Please use a different email.";

      dispatch({
        type: SIGNUP_FAIL,
        payload: errorMessage,
      });

      // toast.error(errorMessage);
      console.log("Signup Error:", errorMessage);
    }
  } catch (emailCheckErr) {
    console.error("Email Check Error:", emailCheckErr);
  }
};



export const verify = (uid, token) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ uid, token });
  try {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/users/activation/`,
      body,
      config
    );
    dispatch({
      type: ACTIVATION_SUCCESS,
    });
  } catch (err) {
    dispatch({
      type: ACTIVATION_FAIL,
    });
  }
};
export const reset_password = (email) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ email });
  try {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/users/reset_password/`,
      body,
      config
    );
    dispatch({
      type: PASSWORD_RESET_SUCCESS,
    });
    toast.success("Request successfully sent. Check your email.");
  } catch (err) {
    dispatch({
      type: PASSWORD_RESET_FAIL,
    });
  }
};
export const reset_password_confirm =
  (uid, token, new_password, re_new_password) => async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ uid, token, new_password, re_new_password });
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/users/reset_password_confirm/`,
        body,
        config
      );
      dispatch({
        type: PASSWORD_RESET_CONFIRM_SUCCESS,
      });
    } catch (err) {
      dispatch({
        type: PASSWORD_RESET_CONFIRM_FAIL,
      });
    }
  };
export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};