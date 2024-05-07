import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/cart.css";
import Navbar from "./Navbar";
import Rating from "./Rating";
import bkash from "../images/BKash-Icon-Logo.wine.svg";
import cashon from "../images/cash-on-delivery.svg";
import Nagad from "../images/Nagad-Vertical-Logo.wine.svg";
import { toast, ToastContainer } from "react-toastify";
const Checkout = React.memo(() => {
  const authToken = localStorage.getItem("authToken");
  const [items, setItems] = useState([]);
  const [cartTotal, setcartTotal] = useState([]);
  const [cartitems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    division: "",
    district: "",
    upazila: "",
    number: "",
    total: "",
  });
  const [selectedDiviison, setSelectedDivision] = useState("");
  const [division, setDivision] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [selecteDistrict, setSelectedDistrict] = useState("");
  const [upzila, setUpzila] = useState([]);
  const [showButton, setShowButton] = useState(true);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [showconfirmbutton, setShowConfirmButton] = useState(false);
  const [productRating, setProductRating] = useState(0);

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

      const { cartItems, carttotal, items } = data;
      setFormData({ ...formData, total: carttotal });
      setCartItems(cartItems);
      setcartTotal(carttotal);
      setItems(items);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDivisionChange = (e) => {
    const districtId = e.target.value;
    setSelectedDivision(districtId);
    setFormData({ ...formData, division: e.target.value });
    setUpzila([]);
  };
  const handleDistrictChange = (e) => {
    const districtId = e.target.value;

    setSelectedDistrict(districtId);
    setFormData({ ...formData, district: e.target.value });
  };
  useEffect(() => {
    const selectedDiviisonData = upazilas.find(
      (district) => district._id === selecteDistrict
    );

    if (selectedDiviisonData) {
      const upazillaArray = selectedDiviisonData.upazilla;
      setUpzila(upazillaArray);
    }
  }, [selecteDistrict, upazilas]);

  const fetchdivision = async () => {
    try {
      const response = await fetch("https://bdapis.com/api/v1.1/divisions");
      const data = await response.json();
      const alldivision = data.data;
      setDivision(alldivision);
    } catch (error) {
      console.error("Error fetching division:", error);
    }
  };

  const fetchUpazilas = async () => {
    try {
      const response = await fetch(
        `https://bdapis.com/api/v1.1/division/${selectedDiviison}`
      );
      const data = await response.json();
      const allUpazilas = data.data;

      setUpazilas(allUpazilas);
    } catch (error) {
      console.error("Error fetching upazilas:", error);
    }
  };
  useEffect(() => {
    sessionStorage.removeItem("redirectFrom");
    fetchCartItems();
    fetchdivision();
    if (selectedDiviison) {
      fetchUpazilas();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDiviison, authToken]);

  const handlecontinue = () => {
    if (cartitems) {
      setShowButton(false);
      setShowPaymentInfo(true);
    } else {
      toast.warning("please first add to cart");
    }
  };
  const handlesubmit = async () => {
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
      console.log(data);
      toast.success(data);
      fetchCartItems();
      setShowButton(true);
      setShowPaymentInfo(false);
      setShowConfirmButton(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="sub_page">
      <Navbar />
      <ToastContainer />
      <div className="container">
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
                    />
                  </div>
                  <div className="form-field">
                    <input
                      required
                      className="form-control"
                      type="text"
                      name="number"
                      placeholder="number.."
                      onChange={(e) =>
                        setFormData({ ...formData, number: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-field">
                    <select
                      id="divisionelect"
                      className="form-control"
                      value={selectedDiviison}
                      onChange={handleDivisionChange}
                    >
                      <option value="" disabled>
                        Select a Divsion...
                      </option>
                      {division.map((division, index) => (
                        <option key={index} value={`${division._id}`}>
                          {`${division.division}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <select
                      id="divisionelect"
                      className="form-control"
                      value={formData.district}
                      onChange={handleDistrictChange}
                    >
                      <option value="" disabled>
                        Select a district...
                      </option>
                      {upazilas.map((district, index) => (
                        <option key={index} value={`${district._id}`}>
                          {`${district.district}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <select
                      id="divisionelect"
                      className="form-control"
                      value={formData.upazila}
                      onChange={(e) =>
                        setFormData({ ...formData, upazila: e.target.value })
                      }
                    >
                      <option value="" disabled>
                        Select a Upazila...
                      </option>
                      {upzila.map((upzila, index) => (
                        <option key={index} value={upzila}>
                          {upzila}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <input
                      required
                      className="form-control"
                      type="text"
                      name="address"
                      placeholder="address.."
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>

                  <hr />
                  {showButton && (
                    <input
                      id="form-button"
                      className="btn btn-success btn-block"
                      value="Place Order"
                      type="button"
                      onClick={handlecontinue}
                    />
                  )}
                </form>
              </div>
            </div>

            <br />
            {showPaymentInfo && (
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
                <Rating
                  initialRating={productRating}
                  onRatingChange={handleRatingChange}
                />
              </div>
            )}
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
                    <div style={{ flex: 2 }}>
                      <img
                        className="row-image"
                        src={`http://localhost:8000${item.variant?.image.image}`}
                        alt={item.variant?.product.name}
                      />
                    </div>
                    <div style={{ flex: 2 }}>
                      <p>{item.variant?.product.name}</p>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p>{item.variant.price}</p>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p>x{item.quantity}</p>
                    </div>
                  </div>
                ))}
              <hr />
              <h5>Items: {cartitems ? cartitems : 0}</h5>
              <h5>Total: {cartTotal ? cartTotal : 0}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Checkout;
