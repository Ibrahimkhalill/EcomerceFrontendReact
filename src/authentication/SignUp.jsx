import React, { useState, useEffect } from "react";
import "./signin.css"; // Create a separate CSS file for styling
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Navbar from "../page/Navbar";
import 'react-toastify/dist/ReactToastify.css';
import { Modal } from "antd";
import { ExclamationCircleOutlined,CheckCircleOutlined } from "@ant-design/icons";
const LoginForm = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");
  const [usernamefocused, setUsernamefocused] = useState(false);
  const [usernameerror, setUsernameerror] = useState("");
  const [emailfocuesd, setEmailfocused] = useState(false);
  const [emailerror, setEmailerror] = useState("");
  const [passwordfocused, setPasswordFocused] = useState(false);
  const [passworderror, setPassworderror] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isValidEmail, setIsValidEmail] = useState(true);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!username && !email && !password){
      setUsernameerror("You can't leave empty");
      setEmailerror("You can't leave empty");
      setPassworderror("You can't leave empty");
      setUsernamefocused(true);
      setEmailfocused(true);
      setPasswordFocused(true);
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
      return
    }
    
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
        }),
      });

      if (response.ok) {
        setSuccess("User Signup successfully");
        setErrorModalVisible(true);
        setUsername("");
        setEmail("");
        setPassword("");
      } else {
        const data = await response.json();
        setError(data.message );
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
            setLoading(true);

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

            setLoading(false);
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
  return (
    <div className="sub_page">
       
      <Navbar />
      <Modal
        title={
          <div>
            {success?<CheckCircleOutlined  style={{ color: "green", marginRight: 8 }}/>:<ExclamationCircleOutlined
              style={{ color: "#f5222d", marginRight: 8 }}
            />}
            
            
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
        <p>{ success ? success : error}</p>
        
      </Modal>
      <div className="container">
      <div className="header_brand">Create your MIK Lifestyle Account</div>
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
                    ? "black"
                    : "",
                  border: "1px solid",
                }}
              />
              {usernameerror && (
                <div style={{ color: "red" }}>{usernameerror}</div>
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
                  border: "1px solid",
                }}
              />
              {emailerror && (
                <div style={{ color: "red" }}>{emailerror}</div>
              )}
              
            </div>
            <div className="field ">
              <label>Password*</label>
             
                <input
                type="password"
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
                  border: "1px solid",
                }}
              />
              {passworderror && (
                <div style={{ color: "red" }}>{passworderror}</div>
              )}
              
              
            </div>
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
                  }}
                  onClick={login}
                  value="Google"
                />
              </i>
            </label>

            <div className="signup">
              Already have an account? <Link to="/login">Login Now</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
   
  )
}

export default LoginForm;
