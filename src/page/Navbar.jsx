import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import cart from "../images/cart.png";
import { CgProfile } from "react-icons/cg";
import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import "../components/i18n";
import bn from "../images/Bangladesh.png";

function CollapsibleExample({ cartItems, serachName }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isLoggedIn =
    localStorage.getItem("authToken") && localStorage.getItem("username");
  const username = localStorage.getItem("username");

  const [q, setQ] = useState("");

  useEffect(() => {
    setQ(serachName);
  }, [serachName]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        navigate("/");
      } else {
        console.error("Logout failed:", response.statusText);
        const text = await response.text();
        console.log("Response text:", text);
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };
  const searchProduct = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/search-product/",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(q),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const { results } = data;
        navigate(`/search-product/?q=${q}`, { state: { result: results } });
      } else {
        console.error(response.statusText);
        const text = await response.text();
        console.log("Response text:", text);
      }
    } catch (error) {
      console.error("An error occurred during search:", error);
    }
  };
  const [cartitems, setCartItems] = useState([]);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/cart-items/", {
          headers: {
            "Content-type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        });
        const data = await response.json();
        const { cartItems } = data;
        setCartItems(cartItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCartItems();
  },);


  return (
    <div className="hero_area">
      <header className="header_section">
        <div className="container">
          <nav className="navbar navbar-expand-lg custom_nav-container ">
            <Link className="navbar-brand" to="/">
              <img width="150" src={logo} alt="#" />
            </Link>

            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav">
                <li className="form-inlines">
                  <div className="serach_input">
                    <input
                      type="text"
                      placeholder={t("search")}
                      aria-label="Search"
                      size="50"
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                    />
                    <button className=" " type="submit" onClick={searchProduct}>
                      <LuSearch style={{ fontSize: "1.2vw" }} />
                    </button>
                  </div>
                </li>
                {isLoggedIn ? (
                  // Render logout button if user is logged in
                  <>
                    <li style={{ width: "8vw", marginRight: "-1vw" }}>
                      <CgProfile style={{ fontSize: "1.2vw" }} />
                      {username}
                    </li>
                    <li style={{ display: "flex", alignItems: "center" }}>
                      <button
                        title="logout"
                        className="btn"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>

                    <li className="cart-image">
                      <Link
                        to="/cart"
                        style={{ border: "none", background: "white" }}
                      >
                        <img className="cart-icon" src={cart} alt="" />
                        <span className="cart-total">
                          {cartItems?.cartitems || cartitems}
                        </span>
                      </Link>
                    </li>
                  </>
                ) : (
                  // Render login and signup buttons if user is not logged in
                  <>
                    <li>
                      <Link className="btn ml-2 " to="/login">
                        {t("login")}
                      </Link>
                    </li>
                    <li>
                      <Link className="btn  " to="/signup">
                        {t("signup")}
                      </Link>
                    </li>
                    <li className="language ml-2">
                      {/* English  */}
                      <img src={bn} width={20} alt="" /> <LanguageSelector />
                    </li>
                    <li>
                      <Link
                        to="/cart"
                        style={{ border: "none", background: "white" }}
                      >
                        <img className="cart-icon" src={cart} alt="" />
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
}

export default CollapsibleExample;
