import React, { useState } from "react";
import SignIn from "./SignIn.jsx";
import "./signup.css";
function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  async function handlesubmit(e) {
    e.preventDefault();
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
        console.log("User registered successfully");

        setSuccessMessage("User registered successfully");
        setError("");
        setIsCheckboxChecked(true);
        setUsername("");
        setEmail("");
        setPassword("");
      } else {
        const data = await response.json();
        setError(data.message || "Registration failed");
        setSuccessMessage("");
        console.error(data.message || "Registration failed");
      }

      setLoading(false);
    } catch (err) {
      setError("An error occurred during registration");
      setSuccessMessage("");
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <>
      <div className="container">
        <div className="main">
          <input
            className="input"
            type="checkbox"
            id="chk"
            aria-hidden="true"
            checked={isCheckboxChecked}
            onChange={() => setIsCheckboxChecked(!isCheckboxChecked)}
          />

          <div className="signup">
            <form onSubmit={handlesubmit}>
              <label className="label" htmlFor="chk" aria-hidden="true">
                Sign up
              </label>
              <input
                className="input"
                type="text"
                name="txt"
                placeholder="User name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                className="input"
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="input"
                type="password"
                name="pswd"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button className="button" type="submit" disabled={loading}>
                Sign up
              </button>
              {error && (
                <p
                  style={{ textAlign: "center", color: "red" }}
                  className="error-message"
                >
                  {error}
                </p>
              )}
              {successMessage && (
                <p
                  style={{ textAlign: "center", color: "green" }}
                  className="success-message"
                >
                  {successMessage}
                </p>
              )}
            </form>
          </div>

          <SignIn />
        </div>
      </div>
    </>
  );
}

export default SignUp;
