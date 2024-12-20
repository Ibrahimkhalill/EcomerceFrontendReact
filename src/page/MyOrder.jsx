import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/cart.css";
import Navbar from "./Navbar";

import { ToastContainer } from "react-toastify";

import FooterResponsive from "../components/FooterResponsive";
// import Footer from './Footer';
import { RotatingLines } from "react-loader-spinner";
const MyOrder = () => {
  const authToken = localStorage.getItem("authToken");
  const [items, setItems] = useState([]);
  const [cartTotal, setcartTotal] = useState([]);
  const [cartitems, setCartItems] = useState([]);
  const [UserData, setUserData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    sessionStorage.removeItem("redirectFrom");
    MyOrderitemsdata();
    fetchUserDetails();
    fetchOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const MyOrderitemsdata = async () => {
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
      const data = await response.json();

      // Extract data from the response
      const { items, carttotal, cartItems } = data;
      // Set state with the extracted data
      setItems(items);
      setCartItems(cartItems);
      setcartTotal(carttotal);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
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
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/api/shipping/address/getAll/`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        }
      );
      const data = await response.json();
      setOrderData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // const handleDeleteOrderItem = async () => {
  //   try {
  //     const response = await fetch(
  //       `http://127.0.0.1:8000/api/order/item/delete/${orderId}`,
  //       {
  //         method: "delete",
  //         headers: {
  //           "Content-type": "application/json",
  //           Authorization: `Token ${authToken}`,
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     } else {
  //       MyOrderitemsdata();
  //       setModalVisible(false);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const formatDate = (isoDate) => {
    console.log(isoDate);
    const date = new Date(isoDate);
    const options = { year: "numeric", month: "short", day: "2-digit" };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    console.log(formattedDate);
    // Extracting time
    const time = date.toLocaleTimeString("en-US", { hour12: false });

    return `${formattedDate} ${time}`;
  };

  const [visible, setVisible] = useState(false);
  const [orderDeatils, setOrderDetails] = useState([]);

  const handleVisible = () => {
    setVisible(false);
  };

  const handleOrderDetails = (orderID) => {
    const filterData =
      orderData &&
      orderData.filter((data) => data.order?.transaction_id === orderID);
    setOrderDetails(filterData);
    setVisible(true);
  };
  // const handleLogout = async () => {
  //   try {
  //     const response = await fetch(`/api/logout/", {
  //       method: "POST",
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log(data);
  //       localStorage.removeItem("authToken");
  //       localStorage.removeItem("username");
  //       navigate("/");
  //     } else {
  //       console.error("Logout failed:", response.statusText);
  //       const text = await response.text();
  //       console.log("Response text:", text);
  //     }
  //   } catch (error) {
  //     console.error("An error occurred during logout:", error);
  //   }
  // };
  // const [isPopupOpen, setIsPopupOpen] = useState(false);
  // const togglePopup = () => {
  //   if (!authToken) {
  //     navigate("/login");
  //     return;
  //   }
  //   setIsPopupOpen(!isPopupOpen);
  // };
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };
    const timeoutId = setTimeout(scrollToTop, 100); // Adjust the delay time as needed

    return () => clearTimeout(timeoutId);
  }, []);
  
  const reversedData = [...orderData].reverse();



  return (
    <>
      <div className="sub_page">
        <Navbar />
        <ToastContainer autoClose={1000} />
        <div className="container">
          {authToken ? (
            <div
              className={`${
                loading ? "product_MyOrder_loading" : "row product_MyOrder "
              } `}
            >
              {loading ? (
                <div className="loading ">
                  <RotatingLines
                    strokeColor="#f57224"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="64"
                    visible={true}
                  />
                </div>
              ) : (
                <>
                  <div className="col-lg-2 account_nav ">
                    <div className="username">Hello, {UserData.username}</div>
                    <div className="account_nav_list">
                      <Link to={"/account/my-profile"}>My Profile</Link>
                      <Link onClick={() => handleVisible()}>My Order</Link>
                      <Link to={"/account/my-wishlist"}>My Wishlist</Link>
                    </div>
                  </div>

                  <div className="col-lg-10 ">
                  {visible && (
                    <button
                      className="ml-1 back_button_my_profile"
                      onClick={handleVisible}
                    >
                      Back
                    </button>
                  )}
                    <h4 className="order_title">
                      {visible ? "Order Details" : "My Order"}
                    </h4>
                    <br />
                    {visible ? (
                      <div>
                        {orderDeatils.length > 0 &&
                          orderDeatils.map((data) => (
                            <div>
                              <div
                                className="box-element "
                                style={{ marginTop: "10px" }}
                              >
                                <div className="order_nav">
                                  <div>
                                    Order #{data.order?.transaction_id}
                                    <p className="date_time">
                                      Placed On{" "}
                                      {formatDate(data.order?.date_orderd)}
                                    </p>
                                  </div>

                                  <div className="order_prduct_price_deatils">
                                    Total: ৳{" "}
                                    {data.order?.get_cart_total +
                                      parseInt(data.delivery_fee?.fee)}
                                  </div>
                                </div>
                                <hr />
                                {data &&
                                  data?.order_items?.map((item) => (
                                    <>
                                      <div className="order_item_section">
                                        <div className="order_image">
                                          <img
                                            src={`${process.env.REACT_APP_ClOUD}${item.variant?.image?.image}`}
                                            alt=""
                                          />
                                        </div>

                                        <div className="order_product_name">
                                          {item.variant?.product?.name}
                                        </div>
                                        <div className="order_prduct_price">
                                          <span>৳</span> {item.variant?.price}
                                        </div>

                                        <div className="order_quantity ">
                                          Qty: {item.quantity}
                                        </div>
                                      </div>
                                    </>
                                  ))}
                              </div>
                              <div className="row">
                                <div className="col-lg-6 box-element ml-2 mr-2">
                                  <h5>Shipping Address</h5>
                                  <div>{data.name}</div>
                                  <div className="address_details">
                                    <span className="delivery_type">Home</span>{" "}
                                    {data.address}
                                  </div>
                                  <div>{data.phone_number}</div>
                                </div>
                                <div className="box-element order_details_delivery_summary">
                                  <div className="header">Total Summary</div>

                                  <div className="summary_list">
                                    <div>Subtotal</div>
                                    <div>
                                      <span>৳</span>
                                      {data.order?.get_cart_total}
                                    </div>
                                  </div>
                                  <div className="summary_list">
                                    <div>Delivery Fee</div>
                                    <div>
                                      <span>৳</span>
                                      {data.delivery_fee?.fee}
                                    </div>
                                  </div>
                                  <hr />
                                  <div className="summary_list">
                                    <div>Total</div>
                                    <div>
                                      <span>৳</span>
                                      {data.order?.get_cart_total +
                                        parseInt(data.delivery_fee?.fee)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : orderData.length > 0 ? (
                      reversedData.map((data) => (
                        <div
                          className="box-element"
                          style={{ marginTop: "10px" }}
                        >
                          <div className="order_nav">
                            <div>
                              Order #{data.order?.transaction_id}
                              <p className="date_time">
                                Placed On {formatDate(data?.date_added)}
                              </p>
                            </div>

                            <Link
                              onClick={() =>
                                handleOrderDetails(data.order?.transaction_id)
                              }
                            >
                              Manage
                            </Link>
                          </div>
                          <hr />
                          {data.order_items.map((item) => (
                            <>
                              <div className="order_item_section desktop_card">
                                <div className="order_image">
                                  <img
                                    src={`${process.env.REACT_APP_ClOUD}${item.variant?.image?.image}`}
                                    alt=""
                                  />
                                </div>
                                <div className="order_product_name ">
                                  {item.variant?.product?.name}
                                </div>
                                <div className="order_quantity">
                                  Qty: {item.quantity}
                                </div>
                                <div className="order_status">
                                  {data?.status?.status_name}
                                </div>
                              </div>
                              <div className="order_item_section responsive_my_order">
                                <div className="responsive_image_product">
                                  <div className="order_image ">
                                    <img
                                      src={`${process.env.REACT_APP_ClOUD}${item.variant?.image?.image}`}
                                      alt=""
                                    />
                                  </div>
                                  <div className="product_qunatity_status">
                                    <div className="order_product_name ">
                                      {item.variant?.product?.name}
                                    </div>
                                    <div className="d-flex justify-content-between">
                                      <div className="order_quantity">
                                        x{item.quantity}
                                      </div>
                                      <div className="order_status">
                                        {data?.status?.status_name}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          ))}
                        </div>
                      ))
                    ) : (
                      <div className="my_wishlist_empty">
                        <div className="my_wishlist_empty_title">
                          <p>There are no order yet.</p>
                          <p>
                            Please first add your product into cart and place
                            order
                          </p>
                        </div>
                        <Link to={"/"}>
                          <button>CONTINUE SHOPPING</button>
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="my_wishlist_empty">
              <div className="my_wishlist_empty_title">
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
      <FooterResponsive />
    </>
  );
};

export default MyOrder;
