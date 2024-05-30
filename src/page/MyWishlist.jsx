import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/cart.css";
import Navbar from "./Navbar";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";

import { MdAddShoppingCart } from "react-icons/md";
import useUpdateUserOrder from "../components/UpdateCart";
// import Footer from './Footer';
import { SlHeart } from "react-icons/sl";
import FooterResponsive from "../components/FooterResponsive";
const MyWishlist = () => {
  const authToken = localStorage.getItem("authToken");
 const updateUserOrder = useUpdateUserOrder()
  const [items, setItems] = useState([]);
  const [cartTotal, setcartTotal] = useState([]);
  const [cartitems, setCartItems] = useState([]);
  const [UserData, setUserData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [wishlistData, setWishListData] = useState([]);

  useEffect(() => {
    sessionStorage.removeItem("redirectFrom");
    MyOrderitemsdata();
    fetchUserDetails();
    fetchOrderDetails();
    fetchWishListProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const fetchWishListProduct = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/wishListProduct/getAll/",
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        }
      );
      const data = await response.json();

      // Set state with the extracted data
      setWishListData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
 

  const [modalVisible, setModalVisible] = useState(false);
  const [wishlistId, setwishlistId] = useState(null);

  const handleDeleteItem = (item) => {
    setModalVisible(true);
    setwishlistId(item);
  };

  const handleDeleteOrderItem = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/watchlist/item/delete/${wishlistId}`,
        {
          method: "delete",
          headers: {
            "Content-type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        fetchWishListProduct();
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateUserOrderCart = async (productId, action) => {
    const count = 1;
    await updateUserOrder(productId, action, count, authToken);
    MyOrderitemsdata();
  };
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
                  <Link to={"/account/my-profile"}>My Profile</Link>
                  <Link to={"/account/my-order"}>My Order</Link>
                  <Link>My Wishlist</Link>    
                </div>
              </div>

              <div className="col-lg-10">
                <h4 className="order_title">
                  {wishlistData
                    ? `My Wishlist (${wishlistData.length})`
                    : "My Wishlist"}
                </h4>
                <br />
                <div>
                  {wishlistData.length > 0 ? (
                    <div className="box-element" style={{ marginTop: "10px" }}>
                      <div className="order_nav">
                        <div>Watchlist</div>
                      </div>

                      {wishlistData.map((data) => (
                        <>
                          <hr />
                          <div className="order_item_section d-none d-lg-flex">
                            <div className="order_image">
                              <img
                                src={`http://localhost:8000${data.variant?.image?.image}`}
                                alt=""
                              />
                            </div>
                            <div className="product_size_color_section_wishlist">
                              <div className="order_product_name_wishlist">
                                {data.variant?.product?.name}
                              </div>
                              <p className="color_family">
                                Color Family: {data.variant?.image?.color?.name}
                              </p>
                              <p className="size_family">
                                Size: {data.variant?.size?.name}
                              </p>
                              <div className="watch_and_delete_div ">
                                <RiDeleteBin6Line
                                  className="delete_icon"
                                  onClick={() => handleDeleteItem(data.id)}
                                  data-toggle="modal"
                                  data-target="#exampleModalCenter"
                                />
                              </div>
                            </div>
                            <div className="order_quantity">
                              ৳ {data.variant?.price}
                            </div>
                            <div className="add_to_cart_wishlist">
                              <button
                                onClick={() =>
                                  updateUserOrderCart(data.variant?.id, "add")
                                }
                              >
                                <MdAddShoppingCart
                                  size={26}
                                  color="rgb(236, 236, 236)"
                                />
                              </button>
                            </div>
                          </div>
                          <div className="order_item_section d-lg-none">
                            <div className="d-flex">

                            <div className="order_image">
                              <img
                                src={`http://localhost:8000${data.variant?.image?.image}`}
                                alt=""
                              />
                            </div>
                            <div className="product_size_color_section_wishlist">
                              <div className="order_product_name_wishlist">
                                {data.variant?.product?.name}
                              </div>
                              <div className="d-flex gap-1">

                              <div className="color_family">
                                Color Family: {data.variant?.image?.color?.name}
                              </div>
                              <div className="size_family ml-2">
                                Size: {data.variant?.size?.name}
                              </div>
                              
                              </div>
                              <div style={{color:"rgb(245, 114, 36)"}}>
                              <span style={{fontSize:"22px"}} >৳</span> {data.variant?.price}
                            </div>
                            <div className="d-flex align-items-center justify-content-between">

                              <div className=" ">
                                <RiDeleteBin6Line
                                  size={20}
                                  className="delete_icon"
                                  onClick={() => handleDeleteItem(data.id)}
                                  data-toggle="modal"
                                  data-target="#exampleModalCenter"
                                />
                              </div>
                              <div className="add_to_cart_wishlist">
                              <button
                                onClick={() =>
                                  updateUserOrderCart(data.variant?.id, "add")
                                }
                              >
                                <MdAddShoppingCart
                                  size={26}
                                  color="rgb(236, 236, 236)"
                                />
                              </button>
                            </div>
                            </div>
                            </div>
                            </div>
                            
                           
                            
                          </div>
                        </>
                      ))}
                    </div>
                  ) : (
                    <div className="my_wishlist_empty">
                      <div className="my_wishlist_empty_title">
                        <SlHeart size={25} />
                        <p>There are no favorites yet.</p>
                        <p>
                          Add your favorites to wishlist and  will show
                          here.
                        </p>
                      </div>
                      <Link to={"/"}>
                        <button>CONTINUE SHOPPING</button>
                      </Link>
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
                  <button
                    type="button"
                    onClick={() => handleDeleteOrderItem()}
                    className="btn btn-primary"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <FooterResponsive wishlist={wishlistData.length}/>
    </>
  );
};

export default MyWishlist;
