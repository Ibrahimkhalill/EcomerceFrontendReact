import React, { useState, useEffect } from "react";
import "./login.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Navbar from "../page/Navbar";
import { Modal } from "antd";
import { RotatingLines } from "react-loader-spinner";
import { useCart } from "../components/CartContext";

import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { FiEye } from "react-icons/fi";
import { PiEyeClosed } from "react-icons/pi";
import { ImGooglePlus } from "react-icons/im";
import AuthenticationNavbar from "./AuthenticationNavbar";
import { useAuth } from "../components/Auth";

const LoginForm = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const location = useLocation();
  const message = location.state?.message;
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Add error state
  const [errorModalVisible, setErrorModalVisible] = useState(false); // Add error modal visibility state
  const [usernamefocused, setUsernamefocused] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordfocused, setPasswordFocused] = useState(false);
  const [passworderror, setPassworderror] = useState("");
  const [success, setSuccess] = useState("");
  const pathname = sessionStorage.getItem("redirectFrom");
  const { setUsernames } = useCart();
  const { Login } = useAuth();

  const navigate = useNavigate();

  function getCSRFToken() {
    const csrfCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="));

    if (csrfCookie) {
      return csrfCookie.split("=")[1];
    }

    return null;
  }
  useEffect(() => {
    if (errorModalVisible) {
      const timerId = setTimeout(() => {
        setErrorModalVisible(false);

        setError("");
      }, 3000);

      return () => clearTimeout(timerId);
    }
  }, [errorModalVisible]);

  useEffect(() => {
    if (message) {
      setSuccess(message);
      setErrorModalVisible(true);
    }
  }, [message]);

  const validateEmail = (inputEmail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(inputEmail);
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setUsername(inputValue);
    if (!validateEmail(inputValue) && inputValue !== "") {
      setUsernameError("Invalid email format!");
    } else {
      setUsernameError("");
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username && !password) {
      setUsernameError("You can't leave empty");
      setPassworderror("You can't leave empty");
      setUsernamefocused(true);
      setPasswordFocused(true);
      return;
    }
    if (!username) {
      setUsernameError("You can't leave empty");
      setUsernamefocused(true);
      return;
    }

    if (!password) {
      setPassworderror("You can't leave empty");
      setPasswordFocused(true);
      return;
    }
   
    if (usernameError) {
      return;
    }

    try {
      setLoading(true);

      const requestBody = {
        username,
        password,
      };
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/api/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.status === 201) {
        const data = await response.json();

        localStorage.setItem("username", username);
        localStorage.setItem("authToken", data.token);
        Login();

        if (pathname) {
          navigate(pathname);
        } else {
          navigate("/");
        }
      } else {
        console.log("Username or password is Incorrect.");
        setError("Username or password is Incorrect.");
        setErrorModalVisible(true);
      }

      setLoading(false);
    } catch (error) {
      console.error("An error occurred during login:", error);

      setError("An unexpected error occurred. Please try again later.");
      setErrorModalVisible(true);
      setLoading(false);
    }
  }

  const [user, setUser] = useState([]);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log("Google login success", codeResponse); // Debugging
      setUser(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  const logingoogle = async () => {
    console.log("Google login initiated"); // Debugging
    login();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        );

        try {
          setLoading(true);

          const googleresponse = await fetch(
            `${process.env.REACT_APP_API_KEY}/api/google/login/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: response.data.name,
              }),
            }
          );

          if (googleresponse.ok) {
            const data = await googleresponse.json();
            if (pathname) {
              navigate(pathname);
            } else {
              navigate("/");
            }
            localStorage.setItem("username", data.username);
            localStorage.setItem("authToken", data.token);
          } else {
            console.error("Login failed:", googleresponse.statusText);

            setError("Username or password is incorrect.");
            setErrorModalVisible(true);
          }

          setLoading(false);
        } catch (err) {
          setError("An error occurred during login");
          setErrorModalVisible(true);

          console.error(err);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    if (user && user.access_token) {
      fetchData();
      setUser("");
    }
  }, [navigate, pathname, setUsernames, user, username]);

  return (
    <div className="sub_page">
      <div className="d-lg-none">
        <AuthenticationNavbar />
      </div>
      <div className="d-none d-lg-block">
        <Navbar />
      </div>

      <div className="login_container">
        <div className="loading">
          {/* {loading && (
            <RotatingLines
              strokeColor="#f57224"
              strokeWidth="5"
              animationDuration="0.75"
              width="64"
              visible={true}
            />
          )} */}
        </div>
        <div className="header_brand_login">
          Welcome to Tanni Fashion House! Please login.
        </div>
        <div className="content_login">
          <div className="first_column">
            <div className="field">
              <label>Email*</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
                required
                onFocus={() => setUsernamefocused(true)}
                onBlur={() => setUsernamefocused(false)}
                style={{
                  borderColor: usernameError
                    ? "red"
                    : usernamefocused
                    ? "black"
                    : "",
                  border: "1px solid white",
                }}
              />
              {usernameError && (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {usernameError}
                </div>
              )}
            </div>
            <div className="field">
              <label>Password*</label>
              <input
                type={passwordVisible ? "text" : "password"}
                className="pass-key"
                required
                placeholder="Password"
                name="password"
                onChange={(event) => {
                  setPassword(event.target.value);
                  setPassworderror("");
                }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                style={{
                  borderColor: passworderror
                    ? "red"
                    : passwordfocused
                    ? "black"
                    : "",
                  border: "1px solid white",
                }}
              />
              {passworderror && (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {passworderror}
                </div>
              )}

              <span className="show" onClick={togglePasswordVisibility}>
                {passwordVisible ? (
                  <FiEye style={{ fontSize: "1.2rem" }} />
                ) : (
                  <PiEyeClosed style={{ fontSize: "1.3rem" }} />
                )}
              </span>
            </div>
            <Link
              className="forget_password"
              style={{ color: "#049cb9" }}
              to={"/user/forget-password"}
            >
              Forget Password?
            </Link>
            {/* {error && <p className="error">{error}</p>} */}
          </div>
          <div className="button_login">
            <label
              className="normal_login"
              style={{
                background: "#2691d9",
                border: "none",
                cursor: "pointer",
              }}
              htmlFor="login"
            >
              <input
                id="login"
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                }}
                disabled={loading}
                onClick={handleSubmit}
                value={"Login"}
              />
            </label>
            <div className="login">Or login with</div>

            <label className="Google" htmlFor="google">
              <ImGooglePlus className="google_icon" />
              <input
                type="button"
                id="google"
                style={{
                  border: "none",
                  background: "none",
                  outline: "none",
                }}
                onClick={logingoogle}
                value="Google"
              />
            </label>

            <div className="signup">
              Don't have an account? <Link to="/signup">Signup Now</Link>
            </div>
          </div>
        </div>
      </div>
      <Modal
        className="modal_autehntication"
        title={
          <div>
            {success ? (
              <CheckCircleOutlined style={{ color: "green", marginRight: 8 }} />
            ) : (
              <ExclamationCircleOutlined
                style={{ color: "#f5222d", marginRight: 8 }}
              />
            )}

            {success ? "Success" : "Error"}
          </div>
        }
        visible={errorModalVisible}
        onOk={null}
        footer={null}
        onCancel={() => setErrorModalVisible(false)}
        width={300}
        height={100}

        // Set footer to null to hide buttons
      >
        <p>{success ? success : error}</p>
      </Modal>
    </div>
  );
};

export default LoginForm;
