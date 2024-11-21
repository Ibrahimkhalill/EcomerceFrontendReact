import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/cart.css";
import { IoGridSharp } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { IoBagHandleOutline } from "react-icons/io5";
import { AiOutlineLogout } from "react-icons/ai";
import { SlHeart } from "react-icons/sl";
import { HiMiniHome } from "react-icons/hi2";
import { useCart } from "./CartContext";
import { useAuth } from "./Auth";
function FooterResponsive(wishlist) {
  const authToken = localStorage.getItem("authToken");
  const [UserData, setUserData] = useState([]);
  const [wishlistData, setWishListData] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { wislistItem, setWislistItem } = useCart();
  useEffect(() => {
    if (authToken) {
      fetchUserDetails();
      fetchWishListProduct();
    }
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/api/user/details/getAll/`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        }
      );
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchWishListProduct = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/api/wishListProduct/getAll/`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        }
      );
      const data = await response.json();
      setWislistItem(data.length);
      // Set state with the extracted data
      setWishListData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
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
        logout();
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        setIsPopupOpen(false);
        window.location.reload();
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
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const togglePopup = () => {
    if (!authToken) {
      navigate("/login");
      return;
    }
    setIsPopupOpen(!isPopupOpen);
  };
  const divRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if the click is outside the div
      if (divRef.current && !divRef.current.contains(event.target)) {
        setIsPopupOpen(false);
      }
    };

    // Attach the event listener to the document
    document.addEventListener("click", handleOutsideClick);

    // Cleanup: Remove the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  return (
    <div className="option_container_responsive_cart_page">
      <div className="home_icon home_page_button_responsive">
        <Link className="responsive_icon" to={"/"}>
          <div className="icon_flex">
            <HiMiniHome size={22} color="#333" />{" "}
            <Link className="responsive_icon" to={"/"}>
              Home
            </Link>
          </div>
        </Link>
        <Link to={authToken ? "/account/my-wishlist" : "/login"}>
          <div className="icon_flex position-relative">
            <SlHeart size={20} color="#333" />
            <Link
              className="responsive_icon "
              to={authToken ? "/account/my-wishlist" : "/login"}
            >
              Wishlist
            </Link>

            <span className="wishlist_total">{wislistItem || 0}</span>
          </div>
        </Link>
        <Link to={"/landingpage/category"}>
          <div className="icon_flex">
            <IoGridSharp size={20} color="#333" />{" "}
            <Link className="responsive_icon" to={"/landingpage/category"}>
              Categories
            </Link>
          </div>
        </Link>
        <div className="icon_flex " ref={divRef} onClick={togglePopup}>
          <FaUser size={20} color="#333" className="cart_icon_postion" />
          Account
        </div>
      </div>
      {isPopupOpen && (
        <div
          className="popup"
          style={{ zIndex: 999, position: "absolute", bottom: 0 }}
        >
          <div className="username_header">Hello ,{UserData.username}</div>
          <div className="my_account_details">
            <div>
              <Link to={"/account/my-profile"}>
                <FaUser size={20} color="#333" className="cart_icon_postion" />
                <span className="ml-2 text-dark ">My Profile</span>
              </Link>
            </div>
            <div>
              <Link to={"/account/my-order"}>
                <IoBagHandleOutline color="black" size={21} />
                <span className="ml-2 text-dark ">My Order</span>
              </Link>
            </div>
            <div>
              <Link to={"/account/my-wishlist"}>
                <SlHeart size={20} color="#333" />
                <span className="ml-2 text-dark  ">My Wishlist</span>
              </Link>
            </div>
            <div onClick={handleLogout}>
              <AiOutlineLogout size={20} />
              <span className="text-dark  ">Logout</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FooterResponsive;
