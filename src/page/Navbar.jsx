import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logoTanni-removebg-preview.png";
import cart from "../images/cart.png";
import { CgProfile } from "react-icons/cg";
import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import "../components/i18n";
import bn from "../images/Bangladesh.png";
import { FaUser } from "react-icons/fa";
import { IoBagHandleOutline } from "react-icons/io5";
import { AiOutlineLogout } from "react-icons/ai";
import { SlHeart } from "react-icons/sl";
import { useCart } from "../components/CartContext";
import { IoCartOutline } from "react-icons/io5";
import { useAuth } from "../components/Auth";

function Navbar({ Items, serachName }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cartItems, setCartItems } = useCart();
  const { logout } = useAuth();
  const isLoggedIn =
    localStorage.getItem("authToken") && localStorage.getItem("username");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const [q, setQ] = useState("");
  const [user, setUser] = useState([]);
  const username = user?.username;
  useEffect(() => {
    setQ(serachName);
  }, [serachName]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/api/logout/`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        logout();
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
        `${process.env.REACT_APP_API_KEY}/api/search-product/`,
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

  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}/api/cart-items/`,
          {
            headers: {
              "Content-type": "application/json",
              Authorization: `Token ${authToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const { cartItems, user } = data;
          setUser(user);
          setCartItems(cartItems);
        } else {
          console.error("Error fetching data:", response.statusText);
          const text = await response.text();
          console.log("Response text:", text);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (authToken) {
      fetchCartItems();
    }
  }, [authToken, setCartItems]);

  const [sidebar, setsidebar] = useState(false);

  const w3_open = () => {
    setsidebar(!sidebar);
  };

  // function w3_close() {
  //   document.getElementById("mySidebar").style.display = "none";
  // }
 
  return (
    <>
      {sidebar && (
        <div class="w3-sidebar w3-bar-block w3-border-right " id="mySidebar">
          <button onClick={w3_open} class="w3-bar-item w3-large">
            Close &times;
          </button>
          <Link class="w3-bar-item w3-button">Link 1</Link>
          <Link class="w3-bar-item w3-button">Link 2</Link>
          <Link class="w3-bar-item w3-button">Link 3</Link>
        </div>
      )}
      <div className={`hero_area ${isScrolled ? "navbar-fixed" : ""}`}>
        <header className="header_section">
          <div className="">
            <nav className="navbar navbar-expand-lg custom_nav-container ">
              <div>
                {/* <button
                  style={{ border: "none", color:"white" }}
                  className="   w3-xlarge"
                  onClick={w3_open}
                >
                  ☰
                </button> */}
                <Link className="navbar-brand" to="/">
                  <img width="150" src={logo} alt="#" />
                </Link>
              </div>

              <Link
                to={authToken ? "/cart" : "/login"}
                className="d-lg-none d-mdx-none"
                style={{ border: "none", color: "white", background: "none" }}
              >
                <IoCartOutline
                  className=" position-relative"
                  size={30}
                  color="white"
                />
                <span className=" cart_total_responsive">
                  {cartItems || Items}
                </span>
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
                      <button
                        className=" "
                        type="submit"
                        onClick={searchProduct}
                      >
                        <LuSearch size={20} />
                      </button>
                    </div>
                  </li>
                  {isLoggedIn ? (
                    // Render logout button if user is logged in
                    <>
                      <li className="dropdown">
                        <div className="dropbtn">
                          <div className="d-flex align-items-center">
                          <CgProfile size={18} />
                          {username}
                          </div>
                          <div> Order & Account</div>
                          <div className="dropdown-content">
                            <Link to="/account/my-profile">
                              <FaUser size={20} /> My Profile
                            </Link>
                            <Link to="/account/my-order">
                              <IoBagHandleOutline size={20} /> My Order
                            </Link>
                            <Link to="/account/my-wishlist">
                              <SlHeart size={18} />
                              My Wishlist
                            </Link>
                            <Link onClick={handleLogout}>
                              <AiOutlineLogout size={20} />
                              Logout
                            </Link>
                          </div>
                        </div>
                      </li>
                      {/* <li style={{ display: "flex", alignItems: "center" }}>
                      <button
                        title="logout"
                        className="btn"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li> */}
                      <li className="language ml-2">
                        {/* English  */}
                        <img src={bn} width={20} alt="" /> <LanguageSelector />
                      </li>
                      <li className="position-relative">
                        <Link
                          to={authToken ? "/cart" : "/login"}
                          style={{ border: "none" }}
                        >
                          <IoCartOutline
                            className=" ml-2 "
                            size={30}
                            color="white"
                          />
                          <span className="cart_item_navbar">
                            {cartItems || Items}
                          </span>
                        </Link>
                      </li>
                    </>
                  ) : (
                    // Render login and signup buttons if user is not logged in
                    <>
                      <li>
                        <Link
                          style={{ color: "white" }}
                          className="btn  ml-2 "
                          to="/login"
                        >
                          {t("login")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          style={{ color: "white" }}
                          className="btn  "
                          to="/signup"
                        >
                          {t("signup")}
                        </Link>
                      </li>
                      <li className="language ml-2">
                        {/* English  */}
                        <img src={bn} width={20} alt="" /> <LanguageSelector />
                      </li>
                      <li>
                        <Link
                          to={authToken ? "/cart" : "/login"}
                          style={{ border: "none" }}
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

      <div
        className={`responsive_search  d-lg-none ${
          isScrolled ? "responsive_search_navbar-fixed" : ""
        }`}
      >
        <div className="search_res_input">
          <input
            type="text"
            placeholder={t("search")}
            aria-label="Search"
            size="50"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className=" " type="submit" onClick={searchProduct}>
            <LuSearch size={23} />
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
