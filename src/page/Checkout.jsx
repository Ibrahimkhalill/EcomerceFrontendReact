/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import "../css/cart.css";
import Navbar from "./Navbar";
import Rating from "./Rating";
import bkash from "../images/BKash-Icon-Logo.wine.svg";
import cashon from "../images/cash-on-delivery.svg";
import Nagad from "../images/Nagad-Vertical-Logo.wine.svg";
import { toast, ToastContainer } from "react-toastify";
import division from "../components/divisions.json";
import district from "../components/districts.json";
import upzila from "../components/upazilas.json";
import OrderConfirm from "./OrderConfirm";
const Checkout = React.memo(() => {
  const authToken = localStorage.getItem("authToken");
  const [items, setItems] = useState([]);
  const [cartTotal, setcartTotal] = useState([]);
  const [cartitems, setCartItem] = useState([]);
  const [statusData, setStausData] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(null);
  const [deliveryFeeID, setDeliveryFeeID] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    division: "",
    district: "",
    upazila: "",
    number: "",
    total: null,
    status: "Pending",
    delivery_id: "",
  });
  const [selectedDiviison, setSelectedDivision] = useState("");
  const [filterDistrictData, setFilterDistrictData] = useState([]);
  const [filterUpzilaData, setFilterUpzilaData] = useState([]);
  const [selecteDistrict, setSelectedDistrict] = useState("");
  const [upzaila_name, setUpzailaName] = useState("");
  const [showButton, setShowButton] = useState(true);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [showOderConfirmPage, setShowOrderConfirmPage] = useState(false);
  const [showconfirmbutton, setShowConfirmButton] = useState(false);
  const [productRating, setProductRating] = useState(0);
  const { setCartItems } = useCart();
  const handleRatingChange = (newRating) => {
    setProductRating(newRating);
  };

  const fetchCartItems = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/cart-items/", {
        headers: {
          "Content-type": "application/json",
          Authorization: `Token ${authToken}`,
        },
      });
      const data = await response.json();

      const { cartItems, carttotal, items, status, delivery } = data;
      setFormData({ ...formData, total: carttotal });
      setCartItem(cartItems);
      setCartItems(cartItems);
      setcartTotal(carttotal);
      setItems(items);
      setStausData(status);
      setDeliveryData(delivery);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDivisionChange = (e) => {
    const districtId = e.target.value;

    setSelectedDivision(districtId);
    const filter_division = division.map((data) =>
      data.data.find((div) => div.id == districtId)
    );

    setFormData({
      ...formData,
      division: filter_division.length > 0 ? filter_division[0]?.name : "",
    });
  };
  const handleDistrictChange = (e) => {
    const districtId = e.target.value;

    setSelectedDistrict(districtId);
    const filter_division = district.map((data) =>
      data.data.find((div) => div.id == districtId)
    );

    setFormData({
      ...formData,
      district: filter_division.length > 0 ? filter_division[0]?.name : "",
    });
  };

  const handleUpzilaChange = (e) => {
    const districtId = e.target.value;

    const filter_division = upzila.map((data) =>
      data.data.find((div) => div.id == districtId)
    );
    setUpzailaName(filter_division[0]?.name);
    setFormData({
      ...formData,
      upazila: filter_division.length > 0 ? filter_division[0]?.name : "",
    });
  };
  useEffect(() => {
    sessionStorage.removeItem("redirectFrom");
    fetchCartItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filterDistrict = district.map((data) =>
      data.data.filter((item) => item.division_id == selectedDiviison)
    );
    const filterDeliveryFee =
      deliveryData &&
      deliveryData.find((data) => data.address == formData.division);
    setFilterDistrictData(filterDistrict);
    setDeliveryFee(filterDeliveryFee?.fee);
    setFormData({
      ...formData,
      delivery_id: filterDeliveryFee?.id,
    });
  }, [selectedDiviison]);

  useEffect(() => {
    const filterDistrict = upzila.map((data) =>
      data.data.filter((item) => item.district_id == selecteDistrict)
    );
    setFilterUpzilaData(filterDistrict);
  }, [selecteDistrict]);

  const handlecontinue = () => {
    if (cartitems) {
      setShowButton(false);
      setShowPaymentInfo(true);
    } else {
      toast.warning("please first add to cart");
    }
  };
  const handlesubmit = async () => {
    console.log("lklkj");
    if (!cartitems) {
      toast.warning("please first add to cart");
      return;
    }
    if (
      formData.name === "" &&
      formData.number === "" &&
      formData.division === "" &&
      formData.upazila === "" &&
      formData.address === ""
    ) {
      setError("can't leave empty");
      return;
    }
    if (formData.name === "") {
      setError("can't leave empty");
      return;
    }
    if (formData.number === "") {
      setError("can't leave empty");
      return;
    }
    if (formData.division === "") {
      setError("can't leave empty");
      return;
    }
    if (formData.upazila === "") {
      setError("can't leave empty");
      return;
    }
    if (formData.address === "") {
      setError("can't leave empty");
      return;
    }
    console.log("kkjlgsdg");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/place-order/", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Token ${authToken}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.status === 200) {
        toast.success(data);
        setFormData({
          name: "",
          address: "",
          division: "",
          district: "",
          upazila: "",
          number: "",
          total: null,
          status: "Pending",
          delivery_id: "",
        });
        fetchCartItems();
        navigate("/order-confirmation");
      } else {
        toast.error(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <>
        <div className="sub_page">
          <Navbar cartItems={cartitems} />
          <ToastContainer autoClose={2000} />

          <div className="container checkout_container">
            <div className="row">
              <div className="col-lg-6">
                <div className="box-element" id="form-wrapper">
                  <div id="shipping-info">
                    <hr />
                    <p>Shipping Information:</p>

                    <form id="form">
                      <hr />
                      <div className="form-field">
                        <input
                          required
                          className="form-control"
                          type="text"
                          name="name"
                          placeholder="Name.."
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          style={{
                            borderColor:
                              error && formData.name === "" ? "red" : "#ccc",
                            border: "1px solid #ccc",
                          }}
                        />
                        {error && formData.name === "" && (
                          <div
                            className="error_message_checkout"
                            style={{ color: "red", fontSize: "12px" }}
                          >
                            {error}
                          </div>
                        )}
                      </div>
                      <div className="form-field">
                        <input
                          required
                          className="form-control"
                          type="text"
                          name="number"
                          placeholder="number.."
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              number: e.target.value,
                            })
                          }
                          style={{
                            borderColor:
                              error && formData.number === "" ? "red" : "#ccc",
                            border: "1px solid #ccc",
                          }}
                        />
                        {error && formData.number === "" && (
                          <div
                            className="error_message_checkout"
                            style={{ color: "red", fontSize: "12px" }}
                          >
                            {error}
                          </div>
                        )}
                      </div>
                      <div className="form-field">
                        <select
                          id="divisionelect"
                          className="form-control"
                          value={selectedDiviison}
                          onChange={handleDivisionChange}
                          style={{
                            borderColor:
                              error && formData.division === ""
                                ? "red"
                                : "#ccc",
                            border: "1px solid #ccc",
                          }}
                        >
                          <option value="" disabled>
                            Select a Divsion...
                          </option>
                          {division.map((item, index) =>
                            item.data.map((div) => (
                              <option key={index} value={`${div.id}`}>
                                {div.name}
                              </option>
                            ))
                          )}
                        </select>
                        {error && formData.division === "" && (
                          <div
                            className="error_message_checkout"
                            style={{ color: "red", fontSize: "12px" }}
                          >
                            {error}
                          </div>
                        )}
                      </div>
                      <div className="form-field">
                        <select
                          id="divisionelect"
                          className="form-control"
                          onChange={handleDistrictChange}
                          style={{
                            borderColor:
                              error && formData.district === ""
                                ? "red"
                                : "#ccc",
                            border: "1px solid #ccc",
                          }}
                        >
                          {formData.division === "" && (
                            <option>Select a district...</option>
                          )}
                          {filterDistrictData.map((item) =>
                            item.map((dis) => (
                              <option value={dis.id}>{dis.name}</option>
                            ))
                          )}
                        </select>
                        {error && formData.district === "" && (
                          <div
                            className="error_message_checkout"
                            style={{ color: "red", fontSize: "12px" }}
                          >
                            {error}
                          </div>
                        )}
                      </div>
                      <div className="form-field">
                        <select
                          id="divisionelect"
                          className="form-control"
                          onChange={handleUpzilaChange}
                          style={{
                            borderColor:
                              error && formData.upazila === "" ? "red" : "#ccc",
                            border: "1px solid #ccc",
                          }}
                        >
                          {formData.district === "" && (
                            <option>Select a Upazila...</option>
                          )}
                          {filterUpzilaData &&
                            filterUpzilaData.map((item) =>
                              item.map((dis) => (
                                <option value={dis.id}>{dis.name}</option>
                              ))
                            )}
                        </select>
                        {error && formData.upazila === "" && (
                          <div
                            className="error_message_checkout"
                            style={{ color: "red", fontSize: "12px" }}
                          >
                            {error}
                          </div>
                        )}
                      </div>
                      <div className="form-field">
                        <input
                          required
                          className="form-control"
                          type="text"
                          name="address"
                          placeholder="address.."
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                          style={{
                            borderColor:
                              error && formData.address === "" ? "red" : "#ccc",
                            border: "1px solid #ccc",
                          }}
                        />
                        {error && formData.address === "" && (
                          <div
                            className="error_message_checkout"
                            style={{ color: "red", fontSize: "12px" }}
                          >
                            {error}
                          </div>
                        )}
                      </div>

                      <hr />
                      {showButton && (
                        <input
                          id="form-button"
                          className="btn btn-success btn-block responsive_submit_button"
                          value="Place Order"
                          type="button"
                          onClick={handlesubmit}
                        />
                      )}
                    </form>
                  </div>
                </div>

                <br />
                {/* {showPaymentInfo && (
              <div className="box-element" id="payment-info">
                <h4>Payment Options</h4>
                <div className="payment_button">
                  <div className="cashon_delivery">
                    <button
                      style={{ outline: "none" }}
                      onClick={() => setShowConfirmButton(true)}
                    >
                      <img width={100} src={cashon} alt="cashon" />
                    </button>
                  </div>
                  <div className="cashon_delivery">
                    <button style={{ outline: "none" }}>
                      <img width={70} src={bkash} alt="bkash" />
                      <br />
                      Bkash
                    </button>
                  </div>
                  <div className="cashon_delivery">
                    <button style={{ outline: "none" }}>
                      <img width={70} src={Nagad} alt="Nagad" />
                      <br />
                      Nagad
                    </button>
                  </div>
                </div>
              </div>
            )}
            <br />
            {showconfirmbutton && (
              <div>
                <button onClick={handlesubmit} className="btn btn-success">
                  Confirm Order
                </button>
                <br />
              </div>
            )} */}
              </div>

              <div className="col-lg-6">
                <div className="box-element">
                  <Link className="btn btn-outline-dark" to="/cart">
                    &#x2190; Back to Cart
                  </Link>
                  <hr />
                  <h3>Order Summary</h3>
                  {items &&
                    items.length > 0 &&
                    items.map((item) => (
                      <div className="cart-row" key={item.variant.id}>
                        <div style={{ flex: 1.3 }}>
                          <img
                            className="row-image"
                            src={`http://localhost:8000${item.variant?.image.image}`}
                            alt={item.variant?.product.name}
                          />
                        </div>
                        <div style={{ flex: 2 }}>
                          <p className="checkou_product_title">
                            {item.variant?.product.name}
                          </p>
                          <p className="color_family">
                            Color Family: {item.variant?.image?.color?.name}
                          </p>
                          <p className="size_family">
                            Size: {item.variant?.size?.name}
                          </p>
                        </div>
                        <div style={{ flex: 1, marginLeft: "10px" }}>
                          <p>{item.variant.price}</p>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p>x{item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  <hr />
                  <div className="order_summary_total">
                    <span style={{ fontWeight: "bold" }}> Items: </span>
                    <div>{cartitems ? cartitems : 0}</div>
                  </div>
                  <div className="order_summary_total">
                    <span style={{ fontWeight: "bold" }}> Items Total: </span>
                    <div>
                      <span className="bd_taka">৳</span>
                      {cartTotal ? cartTotal : 0}
                    </div>
                  </div>
                  <div className="order_summary_total">
                    <span style={{ fontWeight: "bold" }}> Delivery Fee: </span>
                    <div>
                      <span className="bd_taka">৳</span>
                      {deliveryFee || 0}
                    </div>
                  </div>
                  <div className="order_summary_total">
                    <span style={{ fontWeight: "bold" }}> Total Payment: </span>
                    <div>
                      <span className="bd_taka">৳</span>
                      {cartTotal
                        ? cartTotal + (parseInt(deliveryFee) || 120)
                        : 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {cartitems > 0 && (
          <div className="option_container_responsive_cart_page">
            <div className="item_and_total">
              <div className="responsive_total">
                Total: <span>৳</span> {cartTotal}
              </div>
            </div>

            <button onClick={handlesubmit}>
              Place <span>Order</span>
            </button>
          </div>
        )}
      </>
    </>
  );
});

export default Checkout;
