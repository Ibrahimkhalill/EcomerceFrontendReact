import React, { useState, useEffect, useCallback, useRef } from "react";
import "./signin.css"; // Create a separate CSS file for styling
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Navbar from "../page/Navbar";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "antd";
import { FiEye } from "react-icons/fi";
import { PiEyeClosed } from "react-icons/pi";
import { ImGooglePlus } from "react-icons/im";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import AuthenticationNavbar from "./AuthenticationNavbar";
const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [user, setUser] = useState("");
  const [usernamefocused, setUsernamefocused] = useState(false);
  const [usernameerror, setUsernameerror] = useState("");
  const [emailfocuesd, setEmailfocused] = useState(false);
  const [emailerror, setEmailerror] = useState("");
  const [passwordfocused, setPasswordFocused] = useState(false);
  const [passworderror, setPassworderror] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [phone_number, setPhoneNumber] = useState("");
  const [phone_numberfocuesd, setPhone_numberfocused] = useState(false);
  const [phone_numbererror, setPhone_Numbererror] = useState("");
  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  useEffect(() => {
    if (errorModalVisible) {
      const timerId = setTimeout(() => {
        setErrorModalVisible(false);

        setError("");
      }, 3000);

      return () => clearTimeout(timerId);
    }
  }, [errorModalVisible]);

  const handleSubmit = async () => {
    if (!username && !email && !password && !phone_number) {
      setUsernameerror("You can't leave empty");
      setEmailerror("You can't leave empty");
      setPassworderror("You can't leave empty");
      setPhone_Numbererror("You can't leave empty");
      setUsernamefocused(true);
      setEmailfocused(true);
      setPasswordFocused(true);
      setPhone_numberfocused(true);
      return;
    }
    if (!username) {
      setUsernameerror("You can't leave empty");
      setUsernamefocused(true);
      return;
    }
    if (!email) {
      setEmailerror("You can't leave empty");
      setEmailfocused(true);
      return;
    }
    if (!password) {
      setPassworderror("You can't leave empty");
      setPasswordFocused(true);
      return;
    }
    if (!isValidEmail) {
      // Email is valid, you can save the data or perform further actions
      setEmailerror("invalid email address");
      setEmailfocused(true);
      return;
    }

    setTimeLeft(2 * 60);
    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/send/otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (response.ok) {
        setOtpVisible(true);
      } else {
        const data = await response.json();
        setError(data.message);
        setErrorModalVisible(true);
      }

      setLoading(false);
    } catch (err) {
      setError("An error occurred during registration");
      setErrorModalVisible(true);
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpVale = parseInt(otp.join(""));
    console.log(parseInt(otp));
    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/verify-otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: otpVale,
        }),
      });

      if (response.status === 200) {
        try {
          setLoading(true);

          const response = await fetch("http://127.0.0.1:8000/api/signup/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username,
              email,
              password,
              phone_number,
            }),
          });

          if (response.ok) {
            setOtpVisible(false);
            setSuccess("User Signup successfully");
            setErrorModalVisible(true);
            setUsername("");
            setEmail("");
            setPassword("");
            setPhoneNumber("");
          } else {
            const data = await response.json();
            setError(data.message);
            setErrorModalVisible(true);
            setOtpVisible(false);
            setOtpValues(["", "", "", "", ""]);
          }

          setLoading(false);
        } catch (err) {
          setError("An error occurred during registration");
          setErrorModalVisible(true);
          setLoading(false);
        }
      } else {
        const data = await response.json();
        setError(data.message);
        setErrorModalVisible(true);
      }

      setLoading(false);
    } catch (err) {
      setError("An error occurred during registration");
      setErrorModalVisible(true);
      setLoading(false);
    }
  };
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.access_token) {
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
            setGoogleLoading(true);

            const googleresponse = await fetch(
              "http://127.0.0.1:8000/api/google/signup/",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username: response.data.name,
                  email: response.data.email,
                }),
              }
            );

            if (googleresponse.ok && googleresponse.status === 201) {
              setSuccess("User Signup successfully");
              setErrorModalVisible(true);
            } else if (googleresponse.status === 400) {
              const data = await googleresponse.json();

              setError(data.message || "User Name Already Exit");
              setErrorModalVisible(true);
            } else {
              const data = await googleresponse.json();

              setError(data.message);
            }

            setGoogleLoading(false);
          } catch (err) {
            setError("An error occurred during registration");
            setErrorModalVisible(true);

            setLoading(false);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      }
      setUser("");
    };

    fetchData();
  }, [user, navigate]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const [otpVisible, setOtpVisible] = useState("");
  const [timeLeft, setTimeLeft] = useState(2 * 60);
  const [otp, setOtpValues] = useState(["", "", "", "", ""]);
  // Array to store references to input fields
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef()];

  // Function to handle input change
  const handleChange = (index, e) => {
    const value = e.target.value;
    // If the value is a digit and not empty
    if (/^\d*$/.test(value)) {
      // Update the OTP values in the state
      const newOtpValues = [...otp];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);
      // Move focus to the next input field if available
      if (index < inputRefs.length - 1 && value !== "") {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  // Function to handle backspace key
  const handleBackspace = (index, e) => {
    if (e.keyCode === 8 && index > 0 && e.target.value === "") {
      // Move focus to the previous input field
      inputRefs[index - 1].current.focus();
    }
  };

  // Function to concatenate OTP values

  useEffect(() => {
    if (otpVisible) {
      if (timeLeft === 0) return;
      const intervalId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [otpVisible, timeLeft]);

  const resetTimer = useCallback(() => {
    if (timeLeft === 0) {
      setTimeLeft(2 * 60);
      setOtpValues(["", "", "", "", ""]);
      handleSubmit();
    } else {
      return;
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(1, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };
  const handleBack = () => {
    setOtpVisible(false);
  };

  return (
    <div className="sub_page">
      <div className="d-lg-none">
        <AuthenticationNavbar />
      </div>
      <div className="d-none d-lg-block">
        <Navbar />
      </div>
      {errorModalVisible && (
        <Modal
          className="modal_autehntication"
          title={
            <div>
              {success ? (
                <CheckCircleOutlined
                  style={{ color: "green", marginRight: 8 }}
                />
              ) : (
                <ExclamationCircleOutlined
                  style={{ color: "#f5222d", marginRight: 8 }}
                />
              )}

              {success ? "Success" : "Error"}
            </div>
          }
          onOk={null}
          footer={null}
          width={300}
          height={100}

          // Set footer to null to hide buttons
        >
          <p>{success ? success : error}</p>
        </Modal>
      )}
      {!otpVisible && (
        <div className="signup_container">
          <div className="signup_header">
            Create your Tanni Fashion House Account
          </div>
          <div className="content">
            <div className="first_column">
              <div className="field">
                <label>Username*</label>
                <input
                  type="text"
                  name="username"
                  placeholder="username"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                    setUsernameerror("");
                  }}
                  required
                  onFocus={() => setUsernamefocused(true)}
                  onBlur={() => setUsernamefocused(false)}
                  style={{
                    borderColor: usernameerror
                      ? "red"
                      : usernamefocused
                      ? "gray"
                      : "",
                    border: "1px solid white",
                    outline: "none",
                  }}
                />
                {usernameerror && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {usernameerror}
                  </div>
                )}
              </div>
              <div className="field ">
                <label>Email*</label>
                <input
                  type="email"
                  required
                  placeholder="Please enter your email"
                  value={email}
                  name="password"
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setIsValidEmail(emailRegex.test(event.target.value));
                    setEmailerror("");
                  }}
                  onFocus={() => setEmailfocused(true)}
                  onBlur={() => setEmailfocused(false)}
                  style={{
                    borderColor: emailerror
                      ? "red"
                      : emailfocuesd
                      ? "black"
                      : "",
                    border: "1px solid white",
                  }}
                />
                {emailerror && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {emailerror}
                  </div>
                )}
              </div>
              <div className="field ">
                <label>Password*</label>

                <input
                  type={passwordVisible ? "text" : "password"}
                  className="pass-key"
                  required
                  value={password}
                  placeholder="Please enter strong password"
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
            </div>
            <div className="button_login mt-0 ">
              <div className="field">
                <label>Phone number*</label>
                <input
                  type="text"
                  name="Phone number"
                  placeholder="please enter your phone number"
                  value={phone_number}
                  onChange={(event) => {
                    setPhoneNumber(event.target.value);
                    setPhone_Numbererror("");
                  }}
                  required
                  onFocus={() => setPhone_numberfocused(true)}
                  onBlur={() => setPhone_numberfocused(false)}
                  style={{
                    borderColor: phone_numbererror
                      ? "red"
                      : phone_numberfocuesd
                      ? "gray"
                      : "",
                    border: "1px solid white",
                    outline: "none",
                  }}
                />
                {phone_numbererror && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {phone_numbererror}
                  </div>
                )}
              </div>
              <label
                className="normal_login mt-1"
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
                  }}
                  disabled={loading}
                  onClick={handleSubmit}
                  value="Signup"
                />
              </label>
              <div className="login">Or Signup with</div>

              <label className="Google" htmlFor="google">
                <i className="fab fa-google me-2">
                  <ImGooglePlus className="google_icon" />
                  <input
                    type="button"
                    id="google"
                    style={{
                      border: "none",
                      background: "none",
                      marginLeft: "1vw",
                    }}
                    onClick={login}
                    value="Google"
                    disabled={googleLoading}
                  />
                </i>
              </label>

              <div className="signup">
                Already have an account? <Link to="/login">Login Now</Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {otpVisible && (
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="signin_wrapper">
                <div className="user_card">
                  <div className="card-title">
                    <h1 className="text-center mb-3">OTP</h1>
                    <p className="text-center">
                      We have sent a 5 digit code to <span>your email</span>.
                      Put the code in the box below and move forward.
                    </p>
                  </div>
                  <form action="">
                    <div className="row">
                      <div className="col-12">
                        <div className="d-flex">
                          {inputRefs.map((inputRef, index) => (
                            <div key={index} className="otp-input">
                              <input
                                type="text"
                                ref={inputRef}
                                maxLength="1"
                                value={otp[index]}
                                onChange={(e) => handleChange(index, e)}
                                onKeyDown={(e) => handleBackspace(index, e)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 resend-otp-button-section">
                        <button
                          type="button"
                          className="resend-otp-text"
                          onClick={resetTimer}
                        >
                          {timeLeft === 0 && "Resend OTP"}
                          <div
                            className={`${timeLeft === 0 ? " " : "otp_timer"} `}
                          >
                            {timeLeft === 0 ? "" : formatTime(timeLeft)}
                          </div>
                        </button>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="back-btn">
                          <button onClick={handleBack}>Back</button>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="login-btn">
                          <button onClick={handleVerify}>Varify</button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
