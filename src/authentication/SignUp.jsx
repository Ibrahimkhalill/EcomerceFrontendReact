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
import { IoIosArrowBack } from "react-icons/io";
import { RotatingLines } from "react-loader-spinner";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import AuthenticationNavbar from "./AuthenticationNavbar";
import { useAuth } from "../components/Auth";
const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [user, setUser] = useState("");
  const [usernamefocused, setUsernamefocused] = useState(false);
  const [usernameerror, setUsernameError] = useState("");
  const [emailfocuesd, setEmailfocused] = useState(false);
  const [emailerror, setEmailError] = useState("");
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
  const pathname = sessionStorage.getItem("redirectFrom");
  const navigate = useNavigate();
  const { Login } = useAuth();
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

  const validateEmail = (inputEmail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(inputEmail);
  };

  const handleEmailChange = (e) => {
    const inputValue = e.target.value;
    setEmail(inputValue);
    if (!validateEmail(inputValue) && inputValue !== "") {
      setEmailError("Invalid email format!");
    } else {
      setEmailError("");
    }
  };

  const validateFields = () => {
    const fields = {
      username: {
        value: username,
        setError: setUsernameError,
        setFocused: setUsernamefocused,
      },
      email: {
        value: email,
        setError: setEmailError,
        setFocused: setEmailfocused,
      },
      password: {
        value: password,
        setError: setPassworderror,
        setFocused: setPasswordFocused,
      },
      phone_number: {
        value: phone_number,
        setError: setPhone_Numbererror,
        setFocused: setPhone_numberfocused,
      },
    };

    let hasError = false;

    for (const key in fields) {
      const field = fields[key];
      if (!field.value) {
        field.setError("You can't leave empty");
        field.setFocused(true);
        hasError = true;
      } else {
        field.setError(""); // Clear previous errors if the field is valid
      }
    }

    // Additional email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format regex
    if (fields.email.value && !emailRegex.test(fields.email.value)) {
      fields.email.setError("Invalid email format");
      fields.email.setFocused(true);
      hasError = true;
    }

    return !hasError; // Return true if no errors
  };

  const handleSubmit = async () => {
    if (!validateFields()) return; // Exit early if validation fails

    setTimeLeft(2 * 60);
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/send/otp/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        setOtpVisible(true);
      } else {
        const data = await response.json();
        setError(data.message || "An error occurred");
        setErrorModalVisible(true);
      }
    } catch (err) {
      setError("An error occurred during registration");
      setErrorModalVisible(true);
    } finally {
      setLoading(false); // Ensure loading is reset even if an error occurs
    }
  };

  function getCSRFToken() {
    const csrfCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="));

    if (csrfCookie) {
      return csrfCookie.split("=")[1];
    }

    return null;
  }
  async function handleLogin() {
    try {
      setLoading(true);

      const requestBody = {
        username: email,
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
        Login();
        localStorage.setItem("username", username);
        localStorage.setItem("authToken", data.token);

        if (pathname) {
          navigate(pathname);
        } else {
          navigate("/");
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("An error occurred during login:", error);

      setLoading(false);
    }
  }

  const isAllFieldsFilled = () => {
    return otp.every((value) => value === ""); // Returns true if no empty strings
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (isAllFieldsFilled()) {
      setError("Please fill in all OTP fields!");
      setErrorModalVisible(true);
      return;
    }
    const otpVale = parseInt(otp.join(""));
    console.log(parseInt(otp));
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/verify-otp/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp: otpVale,
          }),
        }
      );

      if (response.status === 200) {
        try {
          setLoading(true);

          const response = await fetch(
            `${process.env.REACT_APP_API_KEY}/api/signup/`,
            {
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
            }
          );

          if (response.ok) {
            handleLogin();
          } else {
            const data = await response.json();
            setError(data.message);
            setErrorModalVisible(true);
            setOtpVisible(false);
            setOtpValues(["", "", "", "", "", ""]);
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
              `${process.env.REACT_APP_API_KEY}/api/google/signup/`,
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

            if (googleresponse.ok) {
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
                  Login();
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
                  setLoading(false);
                }

                setLoading(false);
              } catch (err) {
                setError("An error occurred during login");
                setErrorModalVisible(true);

                console.error(err);
                setLoading(false);
              }
            } else if (googleresponse.status === 400) {
              const data = await googleresponse.json();

              setError(data.message || "User Name Already Exit");
              setErrorModalVisible(true);
              setLoading(false);
            } else {
              const data = await googleresponse.json();

              setError(data.message);
              setLoading(false);
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
  const [otp, setOtpValues] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
  ]);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const newOtpValues = [...otp];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);
      if (index < inputRefs.current.length - 1 && value !== "") {
        inputRefs.current[index + 1].current.focus();
      }
    }
  };

  const handleBackspace = (index, e) => {
    if (e.keyCode === 8 && index > 0 && e.target.value === "") {
      inputRefs.current[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, otp.length); // Limiting to OTP length
    const newOtpValues = [...otp];
    pasteData.split("").forEach((char, i) => {
      if (i < newOtpValues.length) {
        newOtpValues[i] = char;
      }
    });
    setOtpValues(newOtpValues);
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
      setOtpValues(["", "", "", "", "", ""]);
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
        {otpVisible ? (
          <div className="hero_area">
            <header className="header_section">
              <div className="">
                <nav className=" responsive_authentication_navbar ">
                  <Link to={"/login"}>
                    <div>
                      <span className="mr-2">
                        <IoIosArrowBack size={27} />
                      </span>
                      {otpVisible ? "Email Verification" : "Forget Password"}
                    </div>
                  </Link>
                </nav>
              </div>
            </header>
          </div>
        ) : (
          <AuthenticationNavbar />
        )}
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
          visible={errorModalVisible}
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
          <div className="loading">
            {loading && (
              <RotatingLines
                strokeColor="#f57224"
                strokeWidth="5"
                animationDuration="0.75"
                width="64"
                visible={true}
              />
            )}
          </div>
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
                    setUsernameError("");
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
                  onChange={handleEmailChange}
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
            </div>
            <div className="button_login mt-0 ">
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
                <div className="loading">
                  {loading && (
                    <RotatingLines
                      strokeColor="#f57224"
                      strokeWidth="5"
                      animationDuration="0.75"
                      width="64"
                      visible={true}
                    />
                  )}
                </div>
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
                          {otp.map((value, index) => (
                            <div key={index} className="otp-input">
                              <input
                                type="text"
                                ref={inputRefs.current[index]}
                                maxLength="1"
                                value={value}
                                onChange={(e) => handleChange(index, e)}
                                onKeyDown={(e) => handleBackspace(index, e)}
                                onPaste={handlePaste}
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
