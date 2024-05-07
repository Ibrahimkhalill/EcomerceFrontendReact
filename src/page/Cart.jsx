import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/cart.css";
import Navbar from "./Navbar";
import updateUserOrder from "../components/UpdateCart";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";

// import Footer from './Footer';

const Cart = () => {
  const authToken = localStorage.getItem("authToken");

  const [items, setItems] = useState([]);
  const [cartTotal, setcartTotal] = useState([]);
  const [cartitems, setCartItems] = useState([]);

  useEffect(() => {
    sessionStorage.removeItem("redirectFrom")
    cartitemsdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cartitemsdata = async () => {
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
        `http://127.0.0.1:8000/api/order/item/delete/${orderId}`,
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

  
  return (
    <>
      <div className="sub_page">
        <Navbar cartItems={cartitems} />
        <ToastContainer autoClose={1000} />
        <div className="container">
          {cartitems ? (
            <div className="row product_cart">
              <div className="col-lg-12">
                <div className="box-element">
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
                          Total: <strong>{cartTotal ? cartTotal : 0}</strong>
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
                <div className="box-element">
                  <div className="cart-row">
                    <div style={{ flex: 2 }}>
                      {" "}
                      <strong>Image</strong>
                    </div>
                    <div style={{ flex: 2 }}>
                      <strong>Item</strong>
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong>Price</strong>
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong>Quantity</strong>
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong>Total</strong>
                    </div>
                  </div>
                  {items &&
                    items.length > 0 &&
                    items.map((item, index) => (
                      <div className="cart-row" key={index}>
                        <div style={{ flex: 2 }}>
                          <img
                            className="row-image"
                            src={`http://localhost:8000${item.variant?.image?.image}`}
                            alt={item.variant?.product.name}
                          />
                        </div>
                        <div style={{ flex: 2 }}>
                          <p>{item.variant?.product.name}</p>
                          <p className="color_family">
                            Color Family: {item.variant?.image?.color?.name}
                          </p>
                          <p className="size_family">
                            Size: {item.variant?.size?.name}
                          </p>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p>BDT: {item.variant?.price}</p>

                          <div className="watch_and_delete_div">
                            
                            <RiDeleteBin6Line
                              className="delete_icon"
                              onClick={() => handleDeleteItem(item.id)}
                              data-toggle="modal"
                              data-target="#exampleModalCenter"
                            />
                          </div>
                        </div>
                        <div className="main_qunatity" style={{ flex: 1 }}>
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
                                style={{ fontSize: "1vw", marginRight: "-1vw" }}
                              >
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateUserOrderCart(item.variant?.id, "add")
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>BDT: {item.get_total}</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="cart_empty">
              <div className="cart_empty_title">
                There are no items in this cart
              </div>
              <Link to={"/"}>
                <button>CONTINUE SHOPPING</button>
              </Link>
            </div>
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
    </>
  );
};

export default Cart;
