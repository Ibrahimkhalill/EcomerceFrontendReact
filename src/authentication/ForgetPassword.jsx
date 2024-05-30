import React, { useState, useEffect, useCallback, useRef } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";

import Navbar from "../page/Navbar";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons"; // Import the correct icon
import { FiEye } from "react-icons/fi";
import { PiEyeClosed } from "react-icons/pi";
import { RotatingLines } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [emailfocuesd, setEmailfocused] = useState(false);
  const [emailerror, setEmailerror] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [error, setError] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [password1Error, setpassword1Error] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [password1Visible, setPassword1Visible] = useState(false);
  const [password2Visible, setPassword2Visible] = useState(false);
  const [visible, setVisible] = useState(false);

  const togglePassword1Visibility = () => {
    setPassword1Visible(!password1Visible);
  };
  const togglePassword2Visibility = () => {
    setPassword2Visible(!password2Visible);
  };
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
    if (!email) {
      setEmailerror("You can't leave empty");
      setEmailfocused(true);
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

      const response = await fetch("http://127.0.0.1:8000/pasword/send/otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          reset: "reset",
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

  const [otpVisible, setOtpVisible] = useState(false);
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
        setVisible(true);
        setOtpVisible(false);
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

  const handlePasswordChanges = async () => {
    if (!password1 && !password2) {
      setpassword1Error("You can't leave empty");
      setError("You can't leave empty");
      return;
    }
    if (!password1) {
      // Email is valid, you can save the data or perform further actions
      setpassword1Error("You can't leave empty");
      return;
    }
    if (password1.length < 6) {
      // Email is valid, you can save the data or perform further actions
      setpassword1Error("password minimum 6 letter");
      return;
    }
    if (!password2) {
      // Email is valid, you can save the data or perform further actions
      setError("You can't leave empty");
      return;
    }
    if (password1 !== password2) {
      // Email is valid, you can save the data or perform further actions
      setError("Password didn't match");
      return;
    }

    navigate('/login', { state: { message: 'Password successfully reset' } });

    // try {
    //   setLoading(true);

    //   const response = await fetch("http://127.0.0.1:8000/password/reset/", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       email,
    //       newpassword: password1,
    //     }),
    //   });

    //   if (response.ok) {
    //     toast("password successfuly reset");
    //     navigate('/login', { state: { message: 'Password successfully reset' } });

    //   } else {
    //     const data = await response.json();
    //     setError(data.message);
    //     setErrorModalVisible(true);
    //   }

    //   setLoading(false);
    // } catch (err) {
    //   setError("An error occurred during registration");
    //   setErrorModalVisible(true);
    //   setLoading(false);
    // }
  };
  console.log(email);
  return (
    <div className="sub_page">
      <ToastContainer />
      <Navbar />
      <Modal
        title={
          <div>
            <ExclamationCircleOutlined
              style={{ color: "#f5222d", marginRight: 8 }}
            />
            Error
          </div>
        }
        visible={errorModalVisible}
        onOk={null}
        onCancel={null}
        footer={null}

        // Set footer to null to hide buttons
      >
        <p>{error}</p>
      </Modal>
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
      {!otpVisible && !visible && (
        <div className="forget_container">
          <div className="header_brand_login">Forget Password</div>
          <div className="reset_content_login ">
            <div className="first_column">
              <h6>
                Enter your email address below and we’ll send you a link to
                reset your password
              </h6>
              <div className="field">
                <label>Email*</label>
                <input
                  type="email"
                  name="username"
                  placeholder="Enter your email"
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setIsValidEmail(emailRegex.test(event.target.value));
                    setEmailerror("");
                  }}
                  required
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
                {emailerror && <div style={{ color: "red" }}>{emailerror}</div>}
              </div>
              <div className="d-flex mt-2">
                <button className="btn btn-info" onClick={handleSubmit}>
                  Submit
                </button>
              </div>

              {/* {error && <p className="error">{error}</p>} */}
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
      {visible && (
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="reset_password">
                <div
                  className="box-element reset-box"
                  style={{ marginTop: "10px" }}
                >
                  <div>
                    <div className="my_password_reset">
                      <label htmlFor="">New Password*</label>
                      <input
                        placeholder="Minimum 6 characters password"
                        type={password1Visible ? "text" : "password"}
                        className="pass-key"
                        onChange={(event) => {
                          setPassword1(event.target.value);
                          setpassword1Error("");
                        }}
                        style={{
                          borderColor: password1Error ? "red" : "",

                          border: "1px solid white",
                        }}
                      />
                      {password1Error && (
                        <div style={{ color: "red", fontSize: "12px" }}>
                          {password1Error}
                        </div>
                      )}
                      <span
                        className="show_password"
                        onClick={togglePassword1Visibility}
                      >
                        {password1Visible ? (
                          <FiEye style={{ fontSize: "1.2rem" }} />
                        ) : (
                          <PiEyeClosed style={{ fontSize: "1.3rem" }} />
                        )}
                      </span>
                    </div>
                    <div className="my_password_reset">
                      <label htmlFor="">Retype Password*</label>
                      <input
                        type={password2Visible ? "text" : "password"}
                        className="pass-key"
                        placeholder="please retype your password"
                        onChange={(event) => {
                          setPassword2(event.target.value);
                          setError("");
                        }}
                        style={{
                          borderColor: error ? "red" : "",

                          border: "1px solid white",
                        }}
                      />
                      {error && (
                        <div style={{ color: "red", fontSize: "12px" }}>
                          {error}
                        </div>
                      )}
                      <span
                        className="show_password"
                        onClick={togglePassword2Visibility}
                      >
                        {password2Visible ? (
                          <FiEye style={{ fontSize: "1.2rem" }} />
                        ) : (
                          <PiEyeClosed style={{ fontSize: "1.3rem" }} />
                        )}
                      </span>
                    </div>
                    <div className="my_password_reset">
                      <button onClick={handlePasswordChanges}>
                        SAVE CHANGES
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;
