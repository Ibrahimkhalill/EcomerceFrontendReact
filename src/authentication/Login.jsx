import React, { useState, useEffect } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Navbar from "../page/Navbar";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons"; // Import the correct icon

const LoginForm = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Add error state
  const [errorModalVisible, setErrorModalVisible] = useState(false); // Add error modal visibility state
  const [usernamefocused, setUsernamefocused] = useState(false);
  const [usernameerror, setUsernameerror] = useState("");
  const [passwordfocused, setPasswordFocused] = useState(false);
  const [passworderror, setPassworderror] = useState("");
  const pathname = sessionStorage.getItem("redirectFrom");
  console.log(pathname);
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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username && !password) {
      setUsernameerror("You can't leave empty");
      setPassworderror("You can't leave empty");
      setUsernamefocused(true);
      setPasswordFocused(true);
      return;
    }
    if (!username) {
      setUsernameerror("You can't leave empty");
      setUsernamefocused(true);
      return;
    }

    if (!password) {
      setPassworderror("You can't leave empty");
      setPasswordFocused(true);
      return;
    }

    try {
      setLoading(true);

      const requestBody = {
        username,
        password,
      };
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 201) {
        const data = await response.json();

        localStorage.setItem("username", username);
        localStorage.setItem("authToken", data.token);
        if (pathname) {
          navigate(pathname);
        } else {
          navigate("/");
        }
      } else {
        console.error("Login failed:", response.statusText);
        const text = await response.text();
        console.log("Response text:", text);

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
            setLoading(true);

            const googleresponse = await fetch(
              "http://127.0.0.1:8000/api/google/login/",
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
              const text = await googleresponse.text();
              console.log("Response text:", text);

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
      }
      setUser("");
    };

    fetchData();
  }, [user, username, navigate, pathname]);

  return (
    <div className="sub_page">
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
        width={300}
        height={100}
        // Set footer to null to hide buttons
      >
        <p>{error}</p>
      </Modal>
      <div className="container">
        <div className="header_brand_login">Welcome to MIK ! Please login.</div>
        <div className="content_login">
          <div className="first_column">
            <div className="field">
              <label>Username*</label>
              <input
                type="text"
                name="username"
                placeholder="username"
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
                    ? "black"
                    : "",
                  border: "1px solid",
                }}
              />
              {usernameerror && (
                <div style={{ color: "red" }}>{usernameerror}</div>
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
                  border: "1px solid",
                }}
              />
              {passworderror && (
                <div style={{ color: "red" }}>{passworderror}</div>
              )}

              <span className="show" onClick={togglePasswordVisibility}>
                {passwordVisible ? "HIDE" : "SHOW"}
              </span>
            </div>
            {/* {error && <p className="error">{error}</p>} */}
          </div>
          <div className="button_login">
            <label
              className="Google"
              style={{ background: "#2691d9", border: "none" }}
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
                value="Login"
              />
            </label>
            <div className="login">Or login with</div>

            <label className="Google" htmlFor="google">
              <i className="fab fa-google me-2">
                <input
                  type="button"
                  id="google"
                  style={{
                    border: "none",
                    background: "none",
                    marginLeft: "1vw",
                    outline: "none",
                  }}
                  onClick={login}
                  value="Google"
                />
              </i>
            </label>

            <div className="signup">
              Don't have an account? <Link to="/signup">Signup Now</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
