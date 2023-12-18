// @ts-nocheck
import React,{useEffect, useState} from "react";
import "./nvbar.css";
import { Link, useNavigate } from "react-router-dom";
// import logo from "./logo-bg.png";
import quiz from "./quiz.jpg";
import { MdOutlineAccountCircle, MdLogout } from "react-icons/md";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Perform a backend API call to logout
      const response = await fetch("https://quiz111.pythonanywhere.com/api/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // You might need to include additional headers like authorization token
        },
        // You can include any data needed for your logout process
        body: JSON.stringify({}),
      });

      if (response.ok) {
        // Clear client-side authentication state
        // For example, you might clear a token from localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");

        // Navigate to the home page after successful logout
        navigate("/");
      } else {
        // Handle error cases
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  // Retrieve the username from local storage
  const username = localStorage.getItem("username");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer); // Clear the timer if the component unmounts
  }, []);
  return (
    <>
      <nav className="nav">
        <ul>
          <li>
            <Link to="/" className="brand">
              <img
                src={quiz}
                className="brand-image"
                alt="Learn with Ibrahim"
              />
            </Link>
          </li>
        </ul>
        <div
          style={{
            marginLeft: "35vw",
            opacity: isVisible ? 0 : 1,
            transition: "opacity 1s ease-in-out",
          }}
        >
          <h2>Welcome to Quiz App!</h2>
        </div>
        <div className="account">
          {username ? (
            <div className="logout_section">
              <div>
                <span className="account_icon" title="Account">
                  <MdOutlineAccountCircle />
                </span>
              </div>
              <div>
                <span>{username}</span>
              </div>
              <div>
                <span
                  className="account_icon"
                  title="Logout"
                  onClick={handleLogout}
                >
                  <MdLogout />
                </span>
              </div>
            </div>
          ) : (
            <>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
