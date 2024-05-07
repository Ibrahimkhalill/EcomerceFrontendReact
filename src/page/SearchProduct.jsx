import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/style.css";
import "../css/bootstrap.css";
import "../css/responsive.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Star from "../images/star.png";
import Loader from "./Loader";
import FreeDelivery from "../images/free.png";
import BestPrice from "../images/Best Price.png";
import Brand from "../images/Brand.png";
import CashOnDelivery from "../images/Cash In Delivery.png";
import GoldenStar from "../images/GoldStar.png";
import NonactiveStar from "../images/Nonactivestar.png";
import { FaListUl } from "react-icons/fa";
import { IoGridSharp } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

import ExperienceIsuue from "../components/ExperienceIsuue";
const SearchProduct = () => {
  const [cartitems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [gridview, setGridview] = useState(true);
  const [listview, setListview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 14;
  const q = queryParams.get("q");
  const { t } = useTranslation();

  const searchResults = location.state.result;

  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    sessionStorage.removeItem("redirectFrom")
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://127.0.0.1:8000/api/cart-items/", {
          headers: {
            "Content-type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        });
        const data = await response.json();
        const { cartItems } = data;
        setCartItems(cartItems);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCartItems();
  }, [authToken]);

  const imageArray1 = Array.from({ length: 5 });
  const imageArray2 = Array.from({ length: 4 });
  const imageArray3 = Array.from({ length: 3 });

  const handlelistview = (e) => {
    setListview(true);
    setGridview(false);
    console.log("hit me");
  };

  const handlegridview = () => {
    setGridview(true);
    setListview(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    searchResults && searchResults.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    // Scroll to the top of the page with smooth behavior
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Set the new current page
    setCurrentPage(newPage);
    // Fetch and update the content based on the new page
    // fetchContent(newPage);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    buttons.push(
      <button
        key="prev"
        onClick={(e) => {
          e.preventDefault();
          handlePageChange(currentPage - 1);
        }}
        disabled={currentPage === 1}
      >
        <IoIosArrowBack />
      </button>
    );

    // Display ellipsis before current page and after current page
    const displayEllipsis = (start, end) => {
      for (let i = start; i <= end; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={currentPage === i ? "active" : ""}
          >
            {i}
          </button>
        );
      }
    };

    if (totalPages <= 7) {
      // If total pages are 7 or less, display all pages
      displayEllipsis(1, totalPages);
    } else {
      // Display pages based on current page
      if (currentPage <= 4) {
        displayEllipsis(1, 5);
        buttons.push(<span key="ellipsis1">...</span>);
        displayEllipsis(totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 3) {
        displayEllipsis(1, 2);
        buttons.push(<span key="ellipsis2">...</span>);
        displayEllipsis(totalPages - 4, totalPages);
      } else {
        displayEllipsis(1, 2);
        buttons.push(<span key="ellipsis3">...</span>);
        displayEllipsis(currentPage - 1, currentPage + 1);
        buttons.push(<span key="ellipsis4">...</span>);
        displayEllipsis(totalPages - 1, totalPages);
      }
    }

    buttons.push(
      <button
        key="next"
        onClick={(e) => {
          e.preventDefault();
          handlePageChange(currentPage + 1);
        }}
        disabled={currentPage === totalPages}
      >
        <IoIosArrowForward />
      </button>
    );

    return buttons;
  };

  if (performance.navigation.type === 1) {
    window.onload = function () {
      window.scrollTo(0, document.body.scrollHeight);
    };
  }

  return (
    <div className="sub_page">
      <Navbar serachName={q} />
      <section className="product_section ">
        {loading ? (
          <Loader />
        ) : (
          <div className="full_div_filter_product">
            <div className="filter_product">
              <div style={{ fontSize: "1.5vw", fontWeight: "bold" }}>
                {t("filter")}
              </div>
              {searchResults.length > 0 && (
                <>
                  <div
                    style={{ fontSize: "18px", fontFamily: "Roboto-Regular;" }}
                  >
                    {t("promotion")}
                  </div>
                  <hr />
                  <div className="promotion_row">
                    <div className="promotion_item">
                      <img width={20} src={FreeDelivery} alt="" />
                      <span>Free Delivery</span>
                    </div>
                    <div className="promotion_item">
                      <img width={22} src={BestPrice} alt="" />
                      <span style={{ marginRight: ".5vw" }}>
                        Best Price Guaranteed
                      </span>
                    </div>
                    <div className="promotion_item">
                      <img
                        width={20}
                        style={{ marginBottom: ".4vw" }}
                        src={Brand}
                        alt=""
                      />
                      <span>Authentic Brands</span>
                    </div>
                    <div className="promotion_item">
                      <img width={20} src={CashOnDelivery} alt="" />
                      <span>Cash On Delivery</span>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      marginTop: "1vw",
                      fontFamily: "Roboto-Regular;",
                    }}
                  >
                    {t("brand")}
                  </div>

                  <hr />
                  <div className="promotion_row_category">
                    <div className="promotion_item_category">
                      <label class="containers">
                        <input type="checkbox" />
                        <span class="checkmark"></span>
                      </label>
                      <span style={{ marginTop: ".5vw" }}>Mohanaz</span>
                    </div>
                    <div className="promotion_item_category">
                      <label class="containers">
                        <input type="checkbox" />
                        <span class="checkmark"></span>
                      </label>
                      <span style={{ marginTop: ".5vw" }}>Alvina</span>
                    </div>
                    <div className="promotion_item_category">
                      <label class="containers">
                        <input type="checkbox" />
                        <span class="checkmark"></span>
                      </label>
                      <span style={{ marginTop: ".5vw" }}>Usha Fasion</span>
                    </div>
                    <div className="promotion_item_category">
                      <label class="containers">
                        <input type="checkbox" />
                        <span class="checkmark"></span>
                      </label>
                      <span style={{ marginTop: ".5vw" }}>Nilima </span>
                    </div>
                    <div className="promotion_item_category">
                      <label class="containers">
                        <input type="checkbox" />
                        <span class="checkmark"></span>
                      </label>
                      <span style={{ marginTop: ".5vw" }}>Easy</span>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      marginTop: "1vw",
                      fontFamily: "Roboto-Regular;",
                    }}
                  >
                    {t("categorys")}
                  </div>

                  <hr />
                  <div className="promotion_row_category">
                    <div className="promotion_item_category">
                      <span>Sarees</span>
                    </div>
                    <div className="promotion_item_category">
                      <span>Shalawar Kameez</span>
                    </div>
                    <div className="promotion_item_category">
                      <span>Kurti</span>
                    </div>
                    <div className="promotion_item_category">
                      <span>Party Wear </span>
                    </div>
                    <div className="promotion_item_category">
                      <span>Palazoo Pants & Culottes</span>
                    </div>
                  </div>
                </>
              )}
              <div
                style={{
                  fontSize: "18px",
                  marginTop: "1vw",
                  fontFamily: "Roboto-Regular;",
                }}
              >
                {t("price")}
              </div>
              <hr />
              <div className="price_filter">
                <input placeholder={t("Min")} type="number" />
                <span>-</span>
                <input placeholder={t("Max")} type="number" />
                <button>{t("apply")}</button>
              </div>
              <div
                style={{
                  fontSize: "18px",
                  marginTop: "2vw",
                  fontFamily: "Roboto-Regular;",
                }}
              >
                {t("rating")}
              </div>
              <hr />
              <div className="rating_filter">
                <div className="image-container">
                  {imageArray1.map((_, index) => (
                    <img width={20} key={index} alt="" src={GoldenStar} />
                  ))}
                </div>
                <div className="image-container">
                  {imageArray2.map((_, index) => (
                    <img width={20} key={index} alt="" src={GoldenStar} />
                  ))}
                  <img width={20} src={NonactiveStar} alt="" />
                  <span
                    style={{
                      fontSize: ".9vw",
                      color: "#000000b3;",
                      opacity: ".70",
                      marginTop: ".5vw",
                      wordSpacing: "-.1vw",
                    }}
                  >
                    & up
                  </span>
                </div>
                <div className="image-container">
                  {imageArray3.map((_, index) => (
                    <img width={20} key={index} alt="" src={GoldenStar} />
                  ))}
                  <img width={20} src={NonactiveStar} alt="" />
                  <img width={20} src={NonactiveStar} alt="" />
                  <span
                    style={{
                      fontSize: ".9vw",
                      color: "#000000b3;",
                      opacity: ".70",
                      marginTop: ".5vw",
                      wordSpacing: "-.1vw",
                    }}
                  >
                    & up
                  </span>
                </div>
                <div className="image-container">
                  <img width={20} src={GoldenStar} alt="" />
                  <img width={20} src={GoldenStar} alt="" />
                  {imageArray3.map((_, index) => (
                    <img width={20} key={index} alt="" src={NonactiveStar} />
                  ))}
                  <span
                    style={{
                      fontSize: ".9vw",
                      color: "#000000b3;",
                      opacity: ".70",
                      marginTop: ".5vw",
                      wordSpacing: "-.1vw",
                    }}
                  >
                    & up
                  </span>
                </div>
                <div className="image-container">
                  <img width={20} src={GoldenStar} alt="" />
                  {imageArray2.map((_, index) => (
                    <img width={20} key={index} alt="" src={NonactiveStar} />
                  ))}
                  <span
                    style={{
                      fontSize: ".9vw",
                      color: "#000000b3;",
                      opacity: ".70",
                      marginTop: ".5vw",
                      wordSpacing: "-.1vw",
                    }}
                  >
                    & up
                  </span>
                </div>
              </div>
              {searchResults.length > 0 && (
                <>
                  <div
                    style={{
                      fontSize: "18px",
                      marginTop: "2vw",
                      fontFamily: "Roboto-Regular;",
                    }}
                  >
                    {t("Warranty")}
                  </div>
                  <hr />
                  <div className="promotion_row_category">
                    <div className="promotion_item_category">
                      <label class="containers">
                        <input type="checkbox" />
                        <span class="checkmark"></span>
                      </label>
                      <span style={{ marginTop: ".5vw" }}>1 Years</span>
                    </div>
                    <div className="promotion_item_category">
                      <label class="containers">
                        <input type="checkbox" />
                        <span class="checkmark"></span>
                      </label>
                      <span style={{ marginTop: ".5vw" }}>2 Years</span>
                    </div>
                    <div className="promotion_item_category">
                      <label class="containers">
                        <input type="checkbox" />
                        <span class="checkmark"></span>
                      </label>
                      <span style={{ marginTop: ".5vw" }}>3 Years</span>
                    </div>
                    <div className="promotion_item_category">
                      <label class="containers">
                        <input type="checkbox" />
                        <span class="checkmark"></span>
                      </label>
                      <span style={{ marginTop: ".5vw" }}>4 Years </span>
                    </div>
                    <div className="promotion_item_category">
                      <label class="containers">
                        <input type="checkbox" />
                        <span class="checkmark"></span>
                      </label>
                      <span style={{ marginTop: ".5vw" }}>5 Years</span>
                    </div>
                    <div className="promotion_item_category">
                      <label class="containers">
                        <input type="checkbox" />
                        <span class="checkmark"></span>
                      </label>
                      <span style={{ marginTop: ".5vw" }}>1 Month</span>
                    </div>
                    <div className="promotion_item_category">
                      <label class="containers">
                        <input type="checkbox" />
                        <span class="checkmark"></span>
                      </label>
                      <span style={{ marginTop: ".5vw" }}>6 Month</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div>
              <div className="item_header">
                <div>
                  {searchResults.length ? searchResults.length : 0} {t("item")}{" "}
                  <span style={{ color: "rgb(248, 86, 6)" }}>"{q}"</span>
                </div>
                <div className="view_item">
                  <span style={{ color: "gray" }}>View:</span>
                  <button onClick={handlegridview}>
                    <IoGridSharp style={{ fontSize: "1.5vw" }} />
                  </button>
                  <button onClick={handlelistview}>
                    <FaListUl style={{ fontSize: "1.5vw", color: "gray" }} />
                  </button>
                </div>
              </div>

              <div style={{ width: "80.3vw", marginLeft: ".5vw" }}>
                {" "}
                <hr />
              </div>
              <div className="container_filter_product">
                {searchResults.length > 0 ? (
                  <>
                    {gridview && (
                      <div className="main_box">
                        {currentItems.map((product) => (
                          <Link
                            key={product.id}
                            style={{ textDecoration: "none", color: "black" }}
                            to={`/products/${product.id}?productId=${product.id}`}
                          >
                            <div className="box">
                              <div className="img-box">
                                <img
                                  src={`http://localhost:8000${product.cover_image}?amp=1`}
                                  alt={product.name}
                                />
                              </div>

                              <div className="detail-box">
                                <div className="title">{product.name}</div>
                                <div className="price_item">
                                  {" "}
                                  <span style={{ fontSize: "1.8vw" }}>
                                    ৳
                                  </span>{" "}
                                  {product.price}
                                </div>

                                <div>
                                  {imageArray1.map((_, index) => (
                                    <img
                                      style={{ height: ".8vw" }}
                                      key={index}
                                      alt=""
                                      src={Star}
                                    />
                                  ))}

                                  <span
                                    style={{
                                      fontSize: ".7vw",
                                      marginLeft: ".5vw",
                                    }}
                                  >
                                    (0)
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    {listview && (
                      <div className="list_main_box">
                        {currentItems.map((product) => (
                          <Link
                            key={product.id}
                            style={{ textDecoration: "none", color: "black" }}
                            to={`/products/${product.id}?productId=${product.id}`}
                          >
                            <div className="list_box">
                              <div className="list_img_box">
                                <img
                                  src={`http://localhost:8000${product.cover_image}?amp=1`}
                                  alt={product.name}
                                />
                              </div>
                              <div className="list_detail-box">
                                <div className="list_title">{product.name}</div>
                                <div className="list_price_item">
                                  {" "}
                                  <span style={{ fontSize: "1.8vw" }}>
                                    ৳
                                  </span>{" "}
                                  {product.price}
                                </div>
                                <div>
                                  {imageArray1.map((_, index) => (
                                    <img
                                      style={{ height: ".8vw" }}
                                      key={index}
                                      alt=""
                                      src={Star}
                                    />
                                  ))}

                                  <span
                                    style={{
                                      fontSize: ".7vw",
                                      marginLeft: ".5vw",
                                    }}
                                  >
                                    (0)
                                  </span>
                                </div>
                                <ul class="b">
                                  <li>Produt Type: Traditional Wear</li>
                                  <li>Color : Black</li>
                                  <li>Gender : Women</li>
                                  <li>Brand : No Brand</li>
                                </ul>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    <div className="last_element">
                      <div>
                        <ExperienceIsuue />
                      </div>

                      <div className="pagination-buttons">
                        {renderPaginationButtons()}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <hr />
                    <div className="serach_result">
                      <div className="search_resut_title">Search No Result</div>
                      <div className="search_resut_des">
                        We're sorry. We cannot find any matches for your search
                        term.
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default SearchProduct;
