import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/cart.css";
import Navbar from "./Navbar";
import Star from "../images/star.png";
import free from "../images/3734738.png";
import Location from "../images/location.png";
import cash from "../images/Taka.png";
import Return from "../images/Return.png";
import warranty from "../images/warranty.png";
import { SlHeart } from "react-icons/sl";
import updateUserOrder from "../components/UpdateCart";
import { ToastContainer, toast } from "react-toastify";
import { FaHeart } from "react-icons/fa";
import q from "../images/q.png";
import a from "../images/a.png";
// import Footer from './Footer';

const ProductDetails = () => {
  const authToken = localStorage.getItem("authToken");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("productId");
  const [cartitems, setCartItems] = useState("");
  const [product, setProduct] = useState([]);
  const [productVariant, setVariant] = useState([]);
  const [hoversize, setHoversize] = useState(null);
  const [clikedsize, setClikedsize] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [color, setColor] = useState(null);
  const [clikedcolor, setClikedColor] = useState(null);
  const [colorname, setColorNmae] = useState(null);
  const [count, setCount] = useState(1);
  const [clickedImage, setClickedImage] = useState(null);
  const [image, setProductImage] = useState("");
  const [imageId, setImageId] = useState(null);
  const [variantId, setVariantId] = useState(null);
  const [wishlistData, setWishListData] = useState([]);
  const [questionAnswerData, setQuestionAnswerData] = useState([]);
  const [question, setQuestion] = useState("");
  const navigate = useNavigate();

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
      const { cartItems } = data;

      // Set state with the extracted data
      setCartItems(cartItems);
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

  const fetchQuestionAnswerData = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/question/answer/getAll/",
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const data = await response.json();

      // Set state with the extracted data
      setQuestionAnswerData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    cartitemsdata();
    fetchWishListProduct();
    fetchQuestionAnswerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = (productId, action) => {
    if (!authToken) {
      navigate("/login");
    } else {
      if (!imageId && !clikedsize) {
        toast.warning("Please Select Size and Color");
        return;
      }
      if (!imageId) {
        toast.warning("Please Select Color");
        return;
      }
      if (!clikedsize) {
        toast.warning("Please Select Size");
        return;
      }

      const data = updateUserOrder(variantId, action, count, authToken);
      setCartItems(data);
      cartitemsdata();
    }
  };
  useEffect(() => {
    const fetchproductid = async () => {
      try {
        if (!productId) {
          console.error("ProductId is undefined");
          return;
        }

        const response = await fetch(
          `http://127.0.0.1:8000/api/get-product-id/${productId}`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const { product, variants } = data;
        console.log(product, variants);
        setProduct(product);
        setVariant(variants);
      } catch (error) {
        console.error(error);
      }
    };

    // Call fetchproductid when the component mounts

    fetchproductid();
  }, [productId]);
  const handleImageChange = (product, index) => {
    setHoveredImage(product.image?.image);
    console.log(product);
    if (product.image.color.name === null) {
      setColor(index + 1);
    } else {
      setColorNmae(product.image?.color?.name);
    }
  };

  const handleMouseLeave = () => {
    setHoveredImage(null);
    setColor(null);
  };
  const handleImageClick = (product, index) => {
    setClickedImage(product.image?.image);
    setImageId(product.image?.id);
    if (product.color === null) {
      setClikedColor(index + 1);
    } else {
      setColorNmae(product.image?.color?.name);
    }
  };

  useEffect(() => {
    if (productVariant && productVariant.length > 0) {
      setProductImage(productVariant[0].image.image);
      setClickedImage(productVariant[0].image.image);
      setClikedsize(productVariant[0]?.size?.name);
      setImageId(productVariant[0].image?.id);

      if (productVariant[0].image?.color?.name === null) setClikedColor(1);
      else {
        setColorNmae(productVariant[0].image?.color?.name);
      }
    }
  }, [productVariant]);

  const handleSizeClick = (item) => {
    setClikedsize(item);
  };
  const handleSizeMouseLeave = () => {
    setHoversize(null);
  };
  const handleSizeChange = (item) => {
    setHoversize(item);
  };

  const [desVisible, setDesVisible] = useState(true);
  const [orderVisible, setOrderVisible] = useState(false);
  const handleDescription = () => {
    setDesVisible(true);
    setOrderVisible(false);
  };
  const handleOrderDes = () => {
    setOrderVisible(true);
    setDesVisible(false);
  };

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };

    // Delay the scroll operation to ensure that the content is fully rendered
    const timeoutId = setTimeout(scrollToTop, 100); // Adjust the delay time as needed

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const filterVariant =
      productVariant &&
      productVariant.find(
        (data) => data.image?.id === imageId && data.size?.name === clikedsize
      );
    setVariantId(filterVariant?.id);
  }, [clikedsize, imageId, productVariant]);

  const [filled, setFilled] = useState(false);
  const [filledID, setFilledID] = useState(null);

  const handleSaveWishlist = async () => {
    setFilled(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/watchlist/product/save/`,
        {
          method: "post",
          headers: {
            "Content-type": "application/json",
            Authorization: `Token ${authToken}`,
          },
          body: JSON.stringify({ variantId: variantId }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        if (response.status === 200) {
          setFilled(false);
        }
        fetchWishListProduct();
        toast(data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const filterWishlist =
      wishlistData.length > 0 &&
      wishlistData.find((data) => data.variant.id === variantId);
    setFilledID(filterWishlist);
  }, [variantId, wishlistData]);

  const convertLocatime = (isoDateString) => {
    const date = new Date(isoDateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const formattedDate = `${day} ${month} ${year}`;
    return formattedDate;
  };

  const handleLoginRedirect = () => {
    // Save the current location to localStorage
    sessionStorage.setItem("redirectFrom", location.pathname + location.search);
    // Redirect to the login page
  };

  const handleSaveQuestion = async () => {
    const today = new Date();
    const localDateTime = today.toISOString();
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/question/answer/save/ ",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Token ${authToken}`,
          },
          body: JSON.stringify({ question, localDateTime, productId }),
        }
      );

      if (response.ok) {
        fetchQuestionAnswerData();
        setQuestion("")
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="sub_page">
        <ToastContainer />
        <Navbar cartItems={cartitems} />
        <div className="product_details_container">
          {product && (
            <>
              <div className="full_div_details">
                <div className="box-element-product">
                  <div className="img-boxx">
                    <img
                      src={`http://localhost:8000${
                        hoveredImage || clickedImage || image
                      }`}
                      alt={product.name}
                    />
                  </div>
                  <div className="product_details_section">
                    <div style={{ fontSize: "1.61vw" }}>{product.name}</div>
                    {/* <div style={{ display: "flex", alignItems: "center" }}>
                    <p>
                      <img style={{ height: "1.2vw" }} src={Star} alt="star" />
                      <img style={{ height: "1.2vw" }} src={Star} alt="star" />
                      <img style={{ height: "1.2vw" }} src={Star} alt="star" />
                      <img style={{ height: "1.2vw" }} src={Star} alt="star" />
                      <img style={{ height: "1.2vw" }} src={Star} alt="star" />
                    </p>
                    <p style={{ marginLeft: ".6vw", marginTop: ".2vw" }}>
                      No ratings
                    </p>
                  </div> */}
                    <div className="brand_name_product_details">
                      <div>
                        <div>
                          Brand: &nbsp;
                          {product.brand === null ? "No Brand" : product.brand}
                        </div>
                        <div
                          style={{
                            display: `${
                              product.material === null ? "none" : "block"
                            }`,
                          }}
                        >
                          Material :{product.material}
                        </div>
                      </div>
                      <div>
                        {filledID ? (
                          <FaHeart
                            className="watchlist_icon active_heart"
                            onClick={() => handleSaveWishlist()}
                          />
                        ) : (
                          <SlHeart
                            className="watchlist_icon "
                            onClick={() => handleSaveWishlist()}
                          />
                        )}
                      </div>
                    </div>
                    <hr />

                    <div style={{ marginBottom: ".8vw" }}>
                      <span
                        style={{
                          fontSize: "1.7vw",
                          color: "#f85606",
                          fontWeight: "bold",
                        }}
                      >
                        ৳
                      </span>
                      <span
                        style={{
                          fontSize: "1.7vw",
                          color: "#f85606",
                          fontWeight: "bold",
                          marginLeft: ".4vw",
                        }}
                      >
                        {product.price}
                      </span>
                    </div>
                    {productVariant && productVariant.length > 0 && (
                      <div className="size_product">
                        <div>
                          Size
                          <span style={{ marginLeft: "4.8vw" }}>
                            {hoversize ||
                              clikedsize ||
                              productVariant[0].size?.name}
                          </span>
                        </div>
                        <div className="size_box">
                          {[
                            ...new Set(
                              productVariant.map((size) => size.size?.name)
                            ),
                          ]
                            .filter((name) => name) // Filter out null or undefined values
                            .map((name, index) => (
                              <div
                                key={index} // Make sure to assign a unique key to each element
                                className={`image-wrap-size ${
                                  clikedsize === name ? "clikedsize" : ""
                                }`}
                                onMouseMove={() => handleSizeChange(name)}
                                onMouseLeave={handleSizeMouseLeave}
                                onClick={() => handleSizeClick(name)}
                              >
                                <div>{name}</div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    <div className="Color_product">
                      {productVariant && (
                        <div>
                          Color Family
                          <span style={{ marginLeft: ".7vw" }}>
                            {color ||
                              clikedcolor ||
                              colorname ||
                              productVariant[0]?.color?.name}
                          </span>
                        </div>
                      )}

                      <div className="samll_image_product">
                        {productVariant &&
                          productVariant.map((item, index) => (
                            <div
                              className={`image-wrap-color ${
                                clickedImage === item.image?.image
                                  ? "clicked"
                                  : ""
                              }`}
                              key={index}
                              onMouseMove={() => handleImageChange(item, index)}
                              onMouseLeave={handleMouseLeave}
                              onClick={() => handleImageClick(item, index)}
                            >
                              <div className="image-layout">
                                <img
                                  src={`http://localhost:8000${item.image?.image}`}
                                  style={{ width: "100%", height: "100%" }}
                                  alt={product}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                    <hr />
                    <div className="Quantity_products">
                      <p>Quantity</p>
                      <button
                        style={{
                          cursor: count === 1 ? "not-allowed" : "pointer",
                          backgroundColor: count === 1 ? "#ccc" : "#ccc", // Change the background color as needed
                        }}
                        disabled={count === 1}
                        onClick={() => setCount(count - 1)}
                      >
                        -
                      </button>
                      <span>{count}</span>
                      <button onClick={() => setCount(count + 1)}>+</button>
                    </div>
                    <div className="option_container">
                      <button onClick={() => handleAdd(product.id, "add")}>
                        Add to cart
                      </button>

                      <Link
                        onClick={() => handleAdd(product.id, "add")}
                        to={authToken ? "/checkout" : "/login"}
                      >
                        Buy Now
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="delivery_details">
                  <div className="Delivery">
                    <div>Delivery</div>
                    <div style={{ display: "flex" }}>
                      <img
                        src={Location}
                        width={24}
                        height={22}
                        style={{ marginTop: ".3vw" }}
                        alt=""
                      />
                      <div className="delivery_address">
                        <span className="address_name">
                          Dhaka, Arambagh, Road-172
                        </span>
                        <button>Change</button>
                      </div>
                    </div>
                  </div>

                  <div className="free_delivery">
                    <hr />
                    <div className="free_delivery_title">
                      <div>
                        <img src={free} width={20} alt="" />
                        <span
                          style={{
                            fontWeight: "600",
                            color: "#212121",
                            fontSize: "14px",
                            marginLeft: ".6vw",
                          }}
                        >
                          Standard Delivery
                        </span>
                      </div>
                      <span style={{ fontSize: ".8vw" }}>9Feb - 15Feb</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "1.8vw",
                        gap: "12.1vw",
                      }}
                    >
                      <div style={{ fontSize: ".8vw", color: "#9e9e9e" }}>
                        5-9 days
                      </div>
                      <div>৳ 55</div>
                    </div>
                    {/* <div className="delivery_card">
                    Enjoy free shipping promotion with minimum spend of ৳ 499
                  </div> */}
                    <div className="delivery_option_item">
                      <img src={cash} width={22} alt="" />
                      <span className="delivery_option_item_title">
                        Cash On Delivery
                      </span>
                    </div>
                  </div>
                  <div className="delivery_service">
                    <hr />
                    <div className="delivery_service_title">Service</div>
                    <div className="deliver_option">
                      <img src={Return} width={21} height={21} alt="" />
                      <span className="delivery_serivice_option">
                        7 Day Return
                      </span>
                    </div>
                    <div className="deliver_option">
                      <img src={warranty} width={21} height={21} alt="" />
                      <span className="delivery_serivice_option">
                        Warranty not avilable
                      </span>
                    </div>
                    <hr />
                  </div>

                  <div className="pdf_seller_info">
                    <div className="pdf_seller_option">
                      <div>Positive Seller Ratings</div>
                      <div className="pdf_seller_rating">87%</div>
                    </div>
                    <div className="pdf_seller_option">
                      <div>Ship on Time</div>
                      <div className="pdf_seller_rating">100%</div>
                    </div>
                    <div className="pdf_seller_option">
                      <div>Chat Response Rate</div>
                      <div className="pdf_seller_rating">100%</div>
                    </div>
                  </div>
                </div>

                <br />
              </div>
              <div className="single_product_nav">
                <div
                  onClick={handleDescription}
                  className={`${desVisible ? "active_description" : ""}`}
                >
                  Description
                </div>
                <div
                  onClick={handleOrderDes}
                  className={`${orderVisible ? "active_description" : ""}`}
                >
                  How to order
                </div>
              </div>
              <div className="product_description_section">
                {desVisible ? (
                  <div dangerouslySetInnerHTML={{ __html: product.details }} />
                ) : (
                  <div>
                    <ul>
                      <li> Select number of product you want to buy.</li>
                      <li>
                        Click
                        <span style={{ fontWeight: "bold" }}>
                          Add To Cart
                        </span>{" "}
                        Button
                      </li>
                      <li>
                        Then go to checkout page If you are a new user, please
                        click on Sign Up.provide us your valid information.
                      </li>
                      <li>
                        Complete your checkout, we received your order, and for
                        order confirmation or customer service contact with you
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="question_and_answer_section">
                <div className="question_header">
                  Questions About This Product ({questionAnswerData.length})
                </div>

                <div className="question_section">
                  {authToken ? (
                    <>
                      <textarea
                        placeholder="ask a question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                      ></textarea>
                      <button onClick={handleSaveQuestion}>ASK QUESTION</button>
                    </>
                  ) : (
                    <div>
                      <Link onClick={() => handleLoginRedirect()} to={"/login"}>
                        Login
                      </Link>{" "}
                      or <Link to={"/signup"}> Register</Link> to ask questions
                      to seller
                    </div>
                  )}
                </div>
                {questionAnswerData &&
                  questionAnswerData.map((data, index) => (
                    <div className="answer_section">
                      <div className="question">
                        <img src={q} width={23} alt="" />

                        <div className="qna-title">
                          {data.question}
                          <p className="qna-meta">
                            {data.user?.username} -{" "}
                            <span>{convertLocatime(data.createAt)}</span>
                          </p>
                        </div>
                      </div>
                      {data.answer && (
                        <div className="answer">
                          <div>
                            <img src={a} width={28} alt="" />
                          </div>
                          <div className="qna-title">
                            {data.answer}
                            <p className="qna-meta">Tanni Fashion House</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
