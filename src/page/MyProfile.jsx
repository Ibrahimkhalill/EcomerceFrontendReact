import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/cart.css";
import Navbar from "./Navbar";
import { FiEye } from "react-icons/fi";
import { PiEyeClosed } from "react-icons/pi";


import { ToastContainer, toast } from "react-toastify";
import { SlHeart } from "react-icons/sl";
import FooterResponsive from "../components/FooterResponsive";
// import Footer from './Footer';

const MyP = () => {
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [cartTotal, setcartTotal] = useState([]);
  const [cartitems, setCartItems] = useState([]);
  const [UserData, setUserData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [user, setUser] = useState([]);
  const [password1Error, setpassword1Error] = useState("");
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState(""); // Add error state
  const [errorModalVisible, setErrorModalVisible] = useState(false); // Add error modal visibility state
  const [passwordfocused, setPasswordFocused] = useState(false);
  const [passworderror, setPassworderror] = useState("");
  useEffect(() => {
    sessionStorage.removeItem("redirectFrom");
    MyOrderitemsdata();
    fetchUserDetails();
    fetchOrderDetails();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password1Visible, setPassword1Visible] = useState(false);
  const [password2Visible, setPassword2Visible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const togglePassword1Visibility = () => {
    setPassword1Visible(!password1Visible);
  };
  const togglePassword2Visibility = () => {
    setPassword2Visible(!password2Visible);
  };
  const MyOrderitemsdata = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/cart-items/", {
        headers: {
          "Content-type": "application/json",
          Authorization: `Token ${authToken}`,
        },
      });
      const data = await response.json();

      // Extract data from the response
      const { items, carttotal, cartItems, user } = data;
      // Set state with the extracted data
      setItems(items);
      setCartItems(cartItems);
      setcartTotal(carttotal);
      setUser(user);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchUserDetails = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/user/details/getAll/",
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
  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/shipping/address/getAll/",
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        }
      );
      const data = await response.json();
      setOrderData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [visible, setVisible] = useState(false);

  const handlevisible = () => {
    setVisible(true);
  };
  const handlevisibleFalse = () => {
    setVisible(false);
  };
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!password1 && !password2 && !password) {
      setPassworderror("You can't leave empty");
      setError("You can't leave empty");
      setpassword1Error("You can't leave empty");
      setPasswordFocused(true);
      return;
    }
    if (!password1 && !password) {
      setPassworderror("You can't leave empty");
      setpassword1Error("You can't leave empty");
      return;
    }
    if (!password1 && !password2) {
      setError("You can't leave empty");
      setpassword1Error("You can't leave empty");
      return;
    }
    if (!password && !password2) {
      setPassworderror("You can't leave empty");
      setError("You can't leave empty");
      return;
    }
    if (!password) {
      setPassworderror("You can't leave empty");
      setPasswordFocused(true);
      return;
    }

    if (!password1) {
      setpassword1Error("You can't leave empty");
      return;
    }
    if (!password2) {
      setError("You can't leave empty");
      return;
    }
    if (password1.length < 6) {
      setpassword1Error("The length of Password should be 6-50 characters");
      return;
    }

    if (password1 !== password2) {
      setError("Password didn't match");
      return;
    }

    try {
      const requestBody = {
        oldpassword: password,
        newpassword: password1,
      };
      const response = await fetch("http://127.0.0.1:8000/password/change/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 200) {
        const data = await response.json();
        toast(data.message);
      } else {
        const data = await response.json();
        console.log("Response text:", data);

        toast.error(data.message);
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error("An error occurred during login:", error);

      setError("An unexpected error occurred. Please try again later.");
      setErrorModalVisible(true);
    }
  }

  return (
    <>
      <div className="sub_page">
        <Navbar MyOrderItems={cartitems} />
        <ToastContainer autoClose={1000} />
        <div className="container">
          {authToken ? (
            <div className="row product_MyOrder">
              <div className="col-lg-2 account_nav ">
                <div className="username">Hello, {UserData.username}</div>
                <div className="account_nav_list">
                  <Link onClick={handlevisibleFalse}>My Profile</Link>
                  <Link to={"/account/my-order"}>My Order</Link>
                  <Link to={"/account/my-wishlist"}>My Wishlist</Link>
                </div>
              </div>

              <div className="col-lg-9">
                <h4 className="order_title mb-3 ml-1">
                  {visible ? "Change Password" : "My Profile"}
                </h4>
                <div className="box-element" style={{ marginTop: "10px" }}>
                  {visible ? (
                    <div>
                      <div className="my_password_change">
                        <label htmlFor="password1">Current Password*</label>
                        <input
                          id="password1"
                          type={passwordVisible ? "text" : "password"}
                          className="pass-key"
                          placeholder="enter your current password"
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
                            border: "1px solid white",
                          }}
                        />
                        {passworderror && (
                          <div style={{ color: "red", fontSize: "12px" }}>
                            {passworderror}
                          </div>
                        )}

                        <span
                          className="show_password responsive_show_password"
                          onClick={togglePasswordVisibility}
                        >
                          {passwordVisible ? (
                            <FiEye style={{ fontSize: "1.2rem" }} />
                          ) : (
                            <PiEyeClosed style={{ fontSize: "1.3rem" }} />
                          )}
                        </span>
                      </div>
                      <div className="my_password_change">
                        <label htmlFor="">New Password*</label>
                        <input
                          placeholder="enter new password"
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
                          className="show_password responsive_show_password"
                          onClick={togglePassword1Visibility}
                        >
                          {password1Visible ? (
                            <FiEye style={{ fontSize: "1.2rem" }} />
                          ) : (
                            <PiEyeClosed style={{ fontSize: "1.3rem" }} />
                          )}
                        </span>
                      </div>
                      <div className="my_password_change">
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
                          className="show_password responsive_show_password"
                          onClick={togglePassword2Visibility}
                        >
                          {password2Visible ? (
                            <FiEye style={{ fontSize: "1.2rem" }} />
                          ) : (
                            <PiEyeClosed style={{ fontSize: "1.3rem" }} />
                          )}
                        </span>
                      </div>
                      <div className="my_password_change">
                        <button onClick={handleSubmit}>SAVE CHANGES</button>
                      </div>
                    </div>
                  ) : (
                    <div className="my_profile_details">
                      <div>Full Name : {user.username}</div>
                      <div>Email Address : {user.email}</div>
                      <div>Mobile Number : {user.phone_number}</div>
                      <div>
                        <button onClick={handlevisible}>CHANGE PASSWORD</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="my_wishlist_empty">
              <div className="my_wishlist_empty_title">
                <SlHeart size={25} />
                <p>There are no favorites yet.</p>
                <p>Add your favorites to wishlist and they will show here.</p>
              </div>
              <Link to={"/"}>
                <button>CONTINUE SHOPPING</button>
              </Link>
            </div>
          )}
        </div>
      </div>
      {modalVisible && (
        <>
          <div
            className="modal fade"
            id="exampleModalCenter"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLongTitle">
                    Remove from wishlist
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  Are you sure you want to delete this item?
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <FooterResponsive />
    </>
  );
};

export default MyP;
