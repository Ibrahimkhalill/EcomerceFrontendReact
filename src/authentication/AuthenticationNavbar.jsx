import { Link, useNavigate, useLocation } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { IoIosArrowBack } from "react-icons/io";

import "../components/i18n";
import "./login.css";

function AuthenticationNavbar() {
  const navigate = useNavigate();

  const location = useLocation();
  const path = location.pathname;

  const handleActive = (name) => {
    if (name === "login") {
      navigate("/login");
    } else {
      navigate("/signup");
    }
  };
  const handleGoBack = () => {
    navigate('/');
  };
  return (
    <>
      <div className="hero_area">
        <header className="header_section">
          <div className="">
            <nav className=" responsive_authentication_navbar ">
              <div>
                
                <span className="mr-2" onClick={handleGoBack}>
                  <IoIosArrowBack size={27}/>
                </span>
                Login / Signup
              </div>
            </nav>
          </div>
        </header>
      </div>

      <div className="responsive_search  d-lg-none">
        <div className="mod_tabs_header">
          <div
            className={`${
              path === "/login" ? "active_link_authen" : "list_header_auten"
            }`}
          >
            <button onClick={() => handleActive("login")}>LOGIN</button>
          </div>
          <div
            className={`${
              path === "/signup" ? "active_link_authen" : "list_header_auten"
            }`}
          >
            <button onClick={() => handleActive("signup")}>SIGNUP</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthenticationNavbar;
