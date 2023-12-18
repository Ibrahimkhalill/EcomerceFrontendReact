import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Add error state

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

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);

      const requestBody = {
        username,
        password,
      };
      const response = await fetch("https://quiz111.pythonanywhere.com/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem("username", username);
        localStorage.setItem("authToken", data.token);

        navigate("/");
      } else {
        console.error("Login failed:", response.statusText);
        const text = await response.text();
        console.log("Response text:", text);

        // Set the error state to display the error message
        setError("Username or password is Incorrect.");
      }

      setLoading(false);
    } catch (error) {
      console.error("An error occurred during login:", error);
      // Set the error state to display the error message
      setError("An unexpected error occurred. Please try again later.");
      setLoading(false);
    }
  }

  return (
    <>
      <div className="login">
        <form onSubmit={handleSubmit}>
          <label className="label" htmlFor="chk" aria-hidden="true">
            Login
          </label>
          <input
            className="input"
            type="text"
            name="username"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            name="pswd"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && (
            <p
              style={{ textAlign: "center", color: "red" }}
              className="error-message"
            >
              {error}
            </p>
          )}
        </form>
      </div>
    </>
  );
}

export default Login;
