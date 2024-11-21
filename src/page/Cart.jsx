import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/cart.css";
import Navbar from "./Navbar";
import useUpdateUserOrder from "../components/UpdateCart";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import { Button, Modal } from "antd";
import { useCart } from "../components/CartContext";
import { RotatingLines } from "react-loader-spinner";
const Cart = () => {
  const authToken = localStorage.getItem("authToken");
  const updateUserOrder = useUpdateUserOrder();
  const [items, setItems] = useState([]);
  const [cartTotal, setcartTotal] = useState([]);
  const [cartitems, setCartItem] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setCartItems } = useCart();
  useEffect(() => {
    sessionStorage.removeItem("redirectFrom");
    cartitemsdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cartitemsdata = async () => {
    try {
      setLoading(true);
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
      console.log(cartItems);
      setItems(items);
      setCartItems(cartItems);
      setCartItem(cartItems);
      setcartTotal(carttotal);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateUserOrderCart = async (productId, action) => {
    const count = 1;
    await updateUserOrder(productId, action, count, authToken);
    cartitemsdata();
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [orderId, setOrderID] = useState(null);

  const handleDeleteItem = (item) => {
    setModalVisible(true);
    setOrderID(item);
  };

  const handleDeleteOrderItem = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/api/order/item/delete/${orderId}`,
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
        cartitemsdata();
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };
    const timeoutId = setTimeout(scrollToTop, 100); // Adjust the delay time as needed

    return () => clearTimeout(timeoutId);
  }, []);
  return (
    <>
      <div className="sub_page">
        <Navbar Items={cartitems} />
        <ToastContainer autoClose={1000} />
        <div className="container ">
          {loading ? (
            <div className="loading_class">
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
              {cartitems ? (
                <div className="row product_cart">
                  <div className="col-lg-12">
                    <div className="box-element first_element_box">
                      <Link className="btn btn-outline-dark" to={"/"}>
                        &#x2190; Continue Shopping
                      </Link>
                      <br />
                      <br />
                      <table className="table">
                        <tr>
                          <th>
                            <h5>
                              Item: <strong>{cartitems ? cartitems : 0}</strong>
                            </h5>
                          </th>
                          <th>
                            <h5>
                              Total:{" "}
                              <strong>{cartTotal ? cartTotal : 0}</strong>
                            </h5>
                          </th>
                          <th>
                            <Link
                              style={{ float: "right", margin: "5px" }}
                              className="btn btn-outline-success"
                              to={"/checkout"}
                            >
                              Checkout
                            </Link>
                          </th>
                        </tr>
                      </table>
                    </div>

                    <br />
                    <div className="box-element cart_container">
                      <div className="cart-row cart_row">
                        <div style={{ flex: 2 }}>
                          {" "}
                          <strong>Image</strong>
                        </div>
                        <div style={{ flex: 2 }}>
                          <strong>Item</strong>
                        </div>
                        <div className="cart_price" style={{ flex: 1 }}>
                          <strong>Price</strong>
                        </div>
                        <div
                          className="cart_section_quantity"
                          style={{ flex: 1 }}
                        >
                          <strong>Quantity</strong>
                        </div>
                        <div className="cart_section_total" style={{ flex: 1 }}>
                          <strong>Total</strong>
                        </div>
                        <div className="cart_section_total" style={{ flex: 1 }}>
                          <strong>Remove</strong>
                        </div>
                      </div>
                      {items &&
                        items.length > 0 &&
                        items.map((item, index) => (
                          <>
                            <div
                              className="cart-row cart_container_bigscreen"
                              key={index}
                            >
                              <div style={{ flex: 1 }}>
                                <img
                                  className="row-image"
                                  src={`${process.env.REACT_APP_ClOUD}${item.variant?.image?.image}`}
                                  alt={item.variant?.product.name}
                                />
                              </div>
                              <div style={{ flex: 2.2 }}>
                                <p>{item.variant?.product.name}</p>
                                <p className="color_family">
                                  Color Family:{" "}
                                  {item.variant?.image?.color?.name}
                                </p>
                                <p className="size_family">
                                  Size: {item.variant?.size?.name}
                                </p>
                              </div>
                              <div
                                style={{
                                  flex: 1,
                                  marginRight: "10px",
                                  textAlign: "center",
                                }}
                              >
                                <p>BDT: {item.variant?.price}</p>
                              </div>
                              <div
                                className="main_qunatity"
                                style={{ flex: 1 }}
                              >
                                <div className="quantity">
                                  <div className="Quantity_products">
                                    <button
                                      style={{ marginRight: "-1vw" }}
                                      onClick={() =>
                                        updateUserOrderCart(
                                          item.variant?.id,
                                          "remove"
                                        )
                                      }
                                    >
                                      -
                                    </button>
                                    <span
                                      style={{
                                        fontSize: "1vw",
                                        marginLeft: "10px",
                                      }}
                                    >
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        updateUserOrderCart(
                                          item.variant?.id,
                                          "add"
                                        )
                                      }
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div style={{ flex: 1 }}>
                                BDT: {item.get_total}
                              </div>
                              <div
                                className="delete_button"
                                style={{ flex: 0.7 }}
                              >
                                <RiDeleteBin6Line
                                  className="delete_icon"
                                  onClick={() => handleDeleteItem(item.id)}
                                  data-toggle="modal"
                                  data-target="#exampleModalCenter"
                                />
                              </div>
                            </div>
                            <div className="responsive_div">
                              <div
                                className="cart-row cart_section"
                                key={index}
                              >
                                <div className="image_name_section">
                                  <div
                                    className="image_section"
                                    style={{ flex: 2 }}
                                  >
                                    <img
                                      className="row-image"
                                      src={`${process.env.REACT_APP_ClOUD}${item.variant?.image?.image}`}
                                      alt={item.variant?.product.name}
                                    />
                                  </div>
                                  <div
                                    style={{ flex: 2, position: "relative" }}
                                  >
                                    <p className="product_name_section">
                                      {item.variant?.product.name}
                                    </p>
                                    <p className="color_family">
                                      Color Family:{" "}
                                      {item.variant?.image?.color?.name}
                                    </p>
                                    <p className="size_family">
                                      Size: {item.variant?.size?.name}
                                    </p>
                                    <div className="watch_and_delete_div">
                                      <RiDeleteBin6Line
                                        className="delete_icon"
                                        onClick={() =>
                                          handleDeleteItem(item.id)
                                        }
                                        data-toggle="modal"
                                        data-target="#exampleModalCenter"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="second_coumn_image_section">
                                  <div
                                    className="price_and_delete_section_cart"
                                    style={{ flex: 1 }}
                                  ></div>
                                  <p>
                                    <span
                                      style={{
                                        fontSize: "1.4rem",
                                        color: "#f85606",
                                      }}
                                    >
                                      ৳
                                    </span>{" "}
                                    <span style={{ fontSize: "15px" }}>
                                      {item.variant?.price}
                                    </span>
                                  </p>

                                  <div
                                    className="main_qunatity"
                                    style={{ flex: 1 }}
                                  >
                                    <div className="quantity">
                                      <div className="Quantity_products">
                                        <button
                                          style={{ marginRight: "-1vw" }}
                                          onClick={() =>
                                            updateUserOrderCart(
                                              item.variant?.id,
                                              "remove"
                                            )
                                          }
                                        >
                                          -
                                        </button>
                                        <span
                                          style={{
                                            fontSize: "1vw",
                                            marginRight: "-1vw",
                                          }}
                                          className="item_quantity"
                                        >
                                          {item.quantity}
                                        </span>
                                        <button
                                          onClick={() =>
                                            updateUserOrderCart(
                                              item.variant?.id,
                                              "add"
                                            )
                                          }
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className="total_item_cart"
                                    style={{ flex: 1 }}
                                  >
                                    BDT: {item.get_total}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="cart_empty">
                  <object
                    id="sc-empty-cart-animated-image"
                    type="image/svg+xml"
                    data="https://m.media-amazon.com/images/G/01/cart/empty/animated/rolling-cart-desaturated._CB405694243_.svg"
                  >
                    <img
                      width={100}
                      alt=""
                      src="https://m.media-amazon.com/images/G/01/cart/empty/animated/cart-fallback-desaturated._CB405682035_.svg"
                    />
                  </object>
                  <h2 class=" ">
                    Your Tanni Fashion House Cart is empty
                  </h2>
                  <div className="cart_empty_title">
                    There are no items in this cart
                  </div>
                  <Link to={"/"}>
                    <button>CONTINUE SHOPPING</button>
                  </Link>
                </div>
              )}
            </>
          )}
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
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLongTitle">
                      Remove from cart
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
                    Item(s) will be removed from order
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
      </div>
      {cartitems > 0 && (
        <div className="option_container_responsive_cart_page">
          <div className="item_and_total">
            <div className="responsive_total">Item: {cartitems} </div>
            <div className="responsive_total">
              Total: <span>৳</span> {cartTotal}
            </div>
          </div>

          <button>
            <Link style={{ color: "white" }} to={"/checkout"}>
              Check <span>Out</span>
            </Link>
          </button>
        </div>
      )}
    </>
  );
};

export default Cart;
