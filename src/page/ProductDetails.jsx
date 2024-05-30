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
import useUpdateUserOrder from "../components/UpdateCart";
import { ToastContainer, toast } from "react-toastify";
import { FaHeart } from "react-icons/fa";
import q from "../images/q.png";
import a from "../images/a.png";
// import Footer from './Footer';
import ReactImageMagnify from "react-image-magnify";
import { IoMdHome } from "react-icons/io";
import { AiOutlineMinus } from "react-icons/ai";
import { GoPlus } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import division from "../components/divisions.json";
import district from "../components/districts.json";
import upzila from "../components/upazilas.json";
import { IoIosArrowBack } from "react-icons/io";
const ProductDetails = () => {
  const updateUserOrder = useUpdateUserOrder();

  const authToken = localStorage.getItem("authToken");
  const location = useLocation();
  const [filterDivision, setfilterDivision] = useState([]);
  const [selectedDiviison, setSelectedDivision] = useState("");
  const [divisName, setDivisioName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [selecteDistrict, setSelectedDistrict] = useState("");
  const [upzaila_name, setUpzailaName] = useState("");
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
  const [loading, setLoading] = useState(false);
  const [quantity, setquantity] = useState(null);
  const [discountPrice, setDiscountprice] = useState(null);
  const [deliveryData, setDeliveryData] = useState([]);
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

      const { cartItems, delivery } = data;
      setDeliveryData(delivery);
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
      // eslint-disable-next-line eqeqeq
      const filterData = data.filter((item) => item.product?.id == productId);

      setQuestionAnswerData(filterData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (authToken) {
      cartitemsdata();
      fetchWishListProduct();
    }
    fetchQuestionAnswerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = async (action) => {
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
      if (!quantity) {
        toast.warning("Sorry This Variation Not Available");
        return;
      }

      try {
        const data = await updateUserOrder(variantId, action, count, authToken);
        setCartItems(data);
        cartitemsdata();
      } catch (error) {
        console.error("Error updating user order:", error);
      }
    }
  };

  useEffect(() => {
    const fetchproductid = async () => {
      try {
        setLoading(true);
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

        setProduct(product);
        setVariant(variants);
        setInterval(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error(error);
      }
    };

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
    const timeoutId = setTimeout(scrollToTop, 100); // Adjust the delay time as needed

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const filterVariant =
      productVariant &&
      productVariant.find((data) =>
        data.size
          ? data.image?.id === imageId && data.size?.name === clikedsize
          : data.image?.id === imageId
      );
    setVariantId(filterVariant?.id);
    setquantity(filterVariant?.quantity);
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
    sessionStorage.setItem("redirectFrom", location.pathname + location.search);
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
        setQuestion("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeCount = (e) => {
    const input = e.target.value;
    if (input <= quantity) {
      if (input >= 1) {
        setCount(parseInt(input));
      }
    } else {
      setCount(quantity);
    }
  };

  const handleAddItem = () => {
    if (count <= quantity) {
      if (quantity === count) {
        setCount(count);
        return;
      }
      setCount(count + 1);
    } else {
      return;
    }
  };
  useEffect(() => {
    if (product?.discount) {
      const discountAmount =
        (parseFloat(product?.price) * parseFloat(product?.discount)) / 100;
      const discountedPrice = product?.price - discountAmount;
      setDiscountprice(Math.round(discountedPrice));
    }
  }, [product.discount, product.price]);

  const [deliveryAddress, setDeliverAddress] = useState(false);

  const handledeliveryAddress = () => {
    setDeliverAddress(!deliveryAddress);
  };
  const handleDivisionSearch = (e) => {
    const divisionName = e.target.value;

    const filter = division.map((data) =>
      data.data.filter((item) =>
        item.name.toLowerCase().includes(divisionName.toLowerCase())
      )
    );

    setfilterDivision(filter);
  };

  const handleFilterDistrict = (id) => {
    if (!divisName) {
      const filterDistrict = district.map((data) =>
        data.data.filter((item) => item.division_id.includes(id))
      );
      const filter = division.map((data) =>
        data.data.find((item) => item.id.includes(id))
      );
      console.log(filter[0].name);
      setDivisioName(filter[0].name);
      setfilterDivision(filterDistrict);
    } else if (!districtName) {
      const filterDistrict = upzila.map((data) =>
        data.data.filter((item) => item.district_id.includes(id))
      );
      const filter = district.map((data) =>
        data.data.find((item) => item.id.includes(id))
      );
      console.log(filter[0].name);
      setDistrictName(filter[0].name);
      setfilterDivision(filterDistrict);
    } else {
      const filterDistrict = upzila.map((data) =>
        data.data.find((item) => item.id.includes(id))
      );
      console.log(filterDistrict[0].name);
      setfilterDivision([]);
      setUpzailaName(filterDistrict[0].name);
      setDeliverAddress(false);
    }
  };
  const formatDateRange = (startDate, endDate) => {
    const options = { month: "short", day: "numeric" };
    const start = startDate.toLocaleDateString("en-US", options);
    const end = endDate.toLocaleDateString("en-US", options);
    return `${start} - ${end}`;
  };

  const calculateDateRange = (days) => {
    const today = new Date();
    const endDate = new Date(today);

    endDate.setDate(today.getDate() + parseInt(days));

    return formatDateRange(today, endDate);
  };

  const [deliveryfee, setDeliveryFee] = useState(null);
  const [range, setRange] = useState(null);

  useEffect(() => {
    if (divisName) {
      const delivery_fee =
        deliveryData && deliveryData.find((data) => data.address === divisName);
      setDeliveryFee(delivery_fee);
      setRange(calculateDateRange(delivery_fee?.duration));
    } else {
      const delivery_fee =
        deliveryData &&
        deliveryData.find((data) => data.address === "Barishal");
      setDeliveryFee(delivery_fee);
      setRange(calculateDateRange(delivery_fee?.duration));
      console.log(delivery_fee);
    }
  }, [deliveryData, divisName]);

  return (
    <>
      <div className="sub_page">
        <ToastContainer autoClose={1000} />
        <Navbar Items={cartitems} />
        <div className="product_details_container">
          {product && (
            <>
              <div className="full_div_details">
                <div className="box-element-product">
                  {loading ? (
                    <div className="img-boxx">
                      <span className="loader"></span>
                    </div>
                  ) : (
                    <div className="img-boxx">
                      <img
                        src={`http://localhost:8000${
                          hoveredImage || clickedImage || image
                        }`}
                        alt={product.name}
                        // className="responsive_image"
                      />

                      {/* <ReactImageMagnify
                        className="preview_image"
                        {...{
                          smallImage: {
                            alt: product.name,
                            isFluidWidth: true,
                            src: `http://localhost:8000${
                              hoveredImage || clickedImage || image
                            }`,
                            
                            width: "200%",
                          },
                          largeImage: {
                            src: `http://localhost:8000${
                              hoveredImage || clickedImage || image
                            }`,
                            sizes: 15000,
                            width: 1800,
                            height: 1800,
                          },
                          enlargedImageContainerDimensions: {
                            width: "200%",
                            height: "100%",
                          },
                        }}
                      /> */}
                    </div>
                  )}

                  <div className="product_details_section">
                    {loading ? (
                      <span class="loader2"></span>
                    ) : (
                      <>
                        <div className="product_header_details_section">
                          {product.name}
                        </div>

                        <div className="brand_name_product_details">
                          <div className="wish_answer_question_nav">
                            <div className="answer_length">
                              {questionAnswerData.length} Answered Questions
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
                          <div className="brand_material_title">
                            <div>
                              Brand: &nbsp;
                              {product.brand === null
                                ? "No Brand"
                                : product.brand?.name}
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
                        </div>
                      </>
                    )}

                    <hr />
                    {loading ? (
                      <span className="loader2"></span>
                    ) : (
                      <>
                        <div style={{ marginBottom: ".8vw" }}>
                          <span
                            className="bdt_taka"
                            style={{
                              fontSize: "1.6rem",
                              color: "#f85606",
                              fontWeight: "bold",
                            }}
                          >
                            ৳
                          </span>
                          <span
                            style={{
                              fontSize: "1.5rem",
                              color: "#f85606",
                              fontWeight: "bold",
                              marginLeft: ".4vw",
                            }}
                          >
                            {discountPrice || product.price}
                          </span>
                          {discountPrice && (
                            <div class="origin-block">
                              <span
                                class=" pdp-price pdp-price_type_deleted pdp-price_color_lightgray pdp-price_size_xs"
                                data-spm-anchor-id="a2a0e.pdp.0.i4.65f77c46EDlqep"
                              >
                                ৳ {product.price}
                              </span>
                              <span class="product-price__discount">
                                -{product.discount}%
                              </span>
                            </div>
                          )}
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
                            <div className="color_title">
                              Color Family
                              <span style={{ marginLeft: ".7rem" }}>
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
                                  onMouseMove={() =>
                                    handleImageChange(item, index)
                                  }
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
                      </>
                    )}
                    <hr />
                    {loading ? (
                      <span className="loader2"></span>
                    ) : (
                      <>
                        <div className=" Product_details_quantity">
                          <p>Quantity</p>
                          <div className="increment_input_decrement">
                            <button
                              className="decreament_button"
                              style={{
                                cursor: count === 1 ? "not-allowed" : "pointer",
                                backgroundColor: count === 1 ? "#ccc" : "#ccc", // Change the background color as needed
                              }}
                              disabled={count === 1}
                              onClick={() => setCount(count - 1)}
                            >
                              <AiOutlineMinus />
                            </button>
                            <input
                              className="count_div"
                              onChange={handleChangeCount}
                              value={count}
                            />
                            <button
                              style={{
                                cursor:
                                  count === quantity
                                    ? "not-allowed"
                                    : "pointer",
                                backgroundColor:
                                  count === quantity ? "#ccc" : "#ccc", // Change the background color as needed
                              }}
                              disabled={count === quantity ? true : false}
                              onClick={handleAddItem}
                            >
                              <GoPlus />
                            </button>
                          </div>
                        </div>
                        <div className="option_container">
                          <button onClick={() => handleAdd("add")}>
                            Add to cart
                          </button>

                          <Link
                            onClick={() => handleAdd("add")}
                            to={authToken ? "/checkout" : "/login"}
                          >
                            Buy Now
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="delivery_details">
                  {loading ? (
                    <span className="loader"></span>
                  ) : (
                    <>
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
                              {divisName || "Barishal"},{" "}
                              {districtName || "Barishal"},{" "}
                              {upzaila_name || "Barishla Sadar"}
                            </span>
                            <button onClick={handledeliveryAddress}>
                              Change
                            </button>
                            {deliveryAddress && (
                              <div className="open_delivery_modal">
                                <div>
                                  <span className="">
                                    {divisName && (
                                      <>
                                        <span> {divisName} </span>
                                        <IoIosArrowBack size={22} />
                                      </>
                                    )}
                                    {districtName && (
                                      <>
                                        <span> {districtName} </span>
                                        <IoIosArrowBack size={22} />
                                      </>
                                    )}
                                  </span>{" "}
                                  Selected Address
                                </div>
                                <div className="location_search">
                                  <input
                                    type="text"
                                    placeholder="Select Address"
                                    onChange={handleDivisionSearch}
                                  />
                                  <CiSearch size={20} />
                                </div>
                                <div className="location-level__main">
                                  {filterDivision.length > 0
                                    ? filterDivision.map((item, index) =>
                                        item.map((div, innerIndex) => (
                                          <div
                                            className="delivery_item"
                                            key={innerIndex} // Use innerIndex as key since it's unique within the map
                                            value={`${item.name}`}
                                            onClick={() =>
                                              handleFilterDistrict(div.id)
                                            }
                                          >
                                            {div.name}
                                          </div>
                                        ))
                                      )
                                    : division.map((item, index) =>
                                        item.data.map((div, innerIndex) => (
                                          <div
                                            className="delivery_item"
                                            key={innerIndex} // Use innerIndex as key since it's unique within the map
                                            value={`${div.name}`}
                                            onClick={() =>
                                              handleFilterDistrict(div.id)
                                            }
                                          >
                                            {div.name}
                                          </div>
                                        ))
                                      )}
                                </div>
                              </div>
                            )}
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
                          <span style={{ fontSize: ".8vw" }}>{range}</span>
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
                            1-{deliveryfee?.duration} days
                          </div>
                          <div>৳ {deliveryfee?.fee}</div>
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
                          <div>Ship on Time</div>
                          <div className="pdf_seller_rating">100%</div>
                        </div>
                        <div className="pdf_seller_option">
                          <div>Chat Response Rate</div>
                          <div className="pdf_seller_rating">100%</div>
                        </div>
                      </div>
                    </>
                  )}
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
                        <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
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
      <div className="option_container_responsive">
        <div className="home_icon">
          <div className="icon_flex">
            <IoMdHome size={25} color="#333" />{" "}
            <Link className="responsive_icon" to={"/"}>
              Home
            </Link>
          </div>
          <div className="icon_flex ">
            <SlHeart
              size={21}
              color="#333"
              className="cart_icon_postion mt-1"
            />
            <Link className="responsive_icon " to={"/cart"}>
              Wishlist
            </Link>
            <span className="cart_total ">{wishlistData.length || 0}</span>
          </div>
        </div>
        <div className="add_to_cart_section">
          <button onClick={() => handleAdd("add")}>Add to cart</button>
          <span className="color_option">
            <Link
              onClick={() => handleAdd("add")}
              to={authToken ? "/checkout" : "/login"}
            >
              <span className="pdp-mod-sbutton-inner">Buy Now</span>{" "}
            </Link>
          </span>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
