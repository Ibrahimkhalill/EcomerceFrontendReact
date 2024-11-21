import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/style.css";
import "../css/bootstrap.css";
import "../css/responsive.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Star from "../images/star.png";
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
import { IoIosClose } from "react-icons/io";

import ExperienceIsuue from "../components/ExperienceIsuue";
import FooterResponsive from "../components/FooterResponsive";
const SubcategoryFilterProduct = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [gridview, setGridview] = useState(true);
  const [listview, setListview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [filterData, setFilterData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [brand, setBrand] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectBrand, setSelectBrand] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [subcategory, setSubCategory] = useState([]);
  const [subcategoryData, setSubCategoryData] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [varintData, setVarinatData] = useState([]);
  const navigate = useNavigate();
  const itemsPerPage = 14;
  const q = queryParams.get("q");
  const { t } = useTranslation();

  const searchResults = location.state.result;

  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    sessionStorage.removeItem("redirectFrom");
    setSearchData(searchResults);
    setFilterData(searchResults);
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}/api/get-products/`
        );
        const data = await response.json();
        const { variant } = data;

        setVarinatData(variant);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchBrand = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}/api/get-brand/`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        const data = await response.json();
        setSubCategory(data.subcategory);
        setBrand(data.brand);
        setInterval(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

 
    fetchBrand();
    fetchData();
  }, [authToken, searchResults]);

  useEffect(() => {
    const filter =
      subcategory && subcategory.find((data) => data.subcategory_name === q);
    setCategoryName(filter?.category?.category_name);
  }, [q, subcategory]);

  useEffect(() => {
    const filter =
      subcategory &&
      subcategory.filter(
        (data) => data.category?.category_name === categoryName
      );
    setSubCategoryData(filter);
  }, [categoryName, q, subcategory]);



  const handlelistview = (e) => {
    setListview(true);
    setGridview(false);
  };

  const handlegridview = () => {
    setGridview(true);
    setListview(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filterData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filterData.length / itemsPerPage);

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
    // Reloaded/refreshed the page
    window.onload = function () {
      // Scroll to the bottom of the page
      window.scrollTo(0, document.body.scrollHeight);
    };
  }

  const [visualMinPrice, setVisualMinPrice] = useState(null);
  const [visualMaxPrice, setVisualMaxPrice] = useState(null);

  // Helper Function
  const filterDataByPriceAndBrand = (min, max, brand) => {
    return searchData.filter((data) => {
      const price = handlePrice(data.id);
      const matchesMinPrice = min ? price >= min : true;
      const matchesMaxPrice = max ? price <= max : true;
      const matchesBrand = brand ? data.brand?.name === brand : true;
      return matchesMinPrice && matchesMaxPrice && matchesBrand;
    });
  };

  // Apply Price Filter
  const handleApplyPrice = () => {
    if (!minPrice && !maxPrice) return;

    const filter = filterDataByPriceAndBrand(minPrice, maxPrice, selectBrand);
    setVisualMinPrice(minPrice || null);
    setVisualMaxPrice(maxPrice || null);
    setFilterData(filter);
    setFilterVisible(true);
  };

  // Cancel Price Filter
  const handleCancelPrice = () => {
    setMaxPrice("");
    setMinPrice("");
    setVisualMaxPrice("");
    setVisualMinPrice("");
    if (!selectBrand) {
      setFilterVisible(false);
      setFilterData(searchResults);
    }
  };

  // Handle Brand Selection
  const handleClickBrand = (name) => {
    if (selectBrand === name) {
      // Deselect brand
      setSelectBrand("");
      setIsChecked(false);
      setFilterData(searchResults);
      handleApplyPrice();
      return;
    }

    // Filter by brand, considering prices if applicable
    const filter = filterDataByPriceAndBrand(minPrice, maxPrice, name);
    setFilterData(filter);
    setIsChecked(true);
    setSelectBrand(name);
    setFilterVisible(true);
  };

  const cancelAll = () => {
    setFilterData(searchResults);
    handleCancelPrice();
    setFilterVisible(false);
    setSelectBrand("");
  };
  const handleSubcategoryClick = async (subcategory) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/api/get-subcategory-product/`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(subcategory.id),
        }
      );
      const data = await response.json();
      const { results } = data;
      navigate(`/filter-product/?q=${subcategory.subcategory_name}`, {
        state: { result: results },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const calculateDiscount = (product) => {
    if (product.discount) {
      const price = handlePrice(product.id);
      const discountAmount =
        (parseFloat(price) * parseFloat(product?.discount)) / 100;
      const discountedPrice = price - discountAmount;
      return Math.round(discountedPrice);
    }
  };
  const handlePrice = (id) => {
    const data = varintData.filter((item) => item.product?.id == id);
    return data[0]?.price;
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
        <Navbar />
        <section className="product_section ">
          <>
            <div className="filter_header">
              Home / {categoryName} / {q} /{" "}
              <span style={{ color: "#f85606" }}>Search result</span>
            </div>
            <div className="full_div_filter_product">
              <div className="filter_product">
                <div style={{ fontSize: "1.5vw", fontWeight: "bold" }}>
                  {t("filter")}
                </div>

                <>
                  <div
                    style={{
                      fontSize: "18px",
                      fontFamily: "Roboto-Regular;",
                    }}
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
                    {t("price")}
                  </div>
                  <hr />
                  <div className="price_filter">
                    <input
                      placeholder={t("Min")}
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      type="number"
                    />
                    <span>-</span>
                    <input
                      placeholder={t("Max")}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      type="number"
                    />
                    <button onClick={handleApplyPrice}>{t("apply")}</button>
                  </div>
                  {brand.length > 0 && (
                    <>
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
                    </>
                  )}
                  {brand.length > 0 && (
                    <>
                      <div className="promotion_row_category">
                        {brand &&
                          brand.map((item) => (
                            <div className="promotion_item_category">
                              <label
                                class="containers"
                                htmlFor={`checkbox-${item.name}`}
                              >
                                <input
                                  type="checkbox"
                                  id={`checkbox-${item.name}`}
                                  checked={
                                    item.name === selectBrand ? isChecked : ""
                                  }
                                  onChange={() => handleClickBrand(item.name)}
                                />
                                <span class="checkmark"></span>
                              </label>
                              <label htmlFor={`checkbox-${item.name}`}>
                                {item.name}
                              </label>
                            </div>
                          ))}
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
                        {subcategoryData.map((data) => (
                          <div
                            className="promotion_item_category"
                            onClick={() => handleSubcategoryClick(data)}
                          >
                            <span>{data.subcategory_name}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>

                {/* <div
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
              </div> */}
                {filterData.length > 0 && (
                  <>
                    {/* <div
                    style={{
                      fontSize: "18px",
                      marginTop: "2vw",
                      fontFamily: "Roboto-Regular;",
                    }}
                  >
                    {t("Warranty")}
                  </div> */}
                    {/* <hr /> */}
                    {/* <div className="promotion_row_category">
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
                  </div> */}
                  </>
                )}
              </div>
              <div>
                <div className="item_header">
                  <div>
                    {filterData.length ? filterData.length : 0} {t("item")}{" "}
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

                <div
                  className="hr_tag"
                  style={{ width: "80.3vw", marginLeft: ".5vw" }}
                >
                  <hr />
                </div>
                {filterVisible && (
                  <div className="main_div_filter">
                    {(visualMaxPrice || visualMinPrice) && (
                      <div className="filter_data">
                        Price : {visualMinPrice}-{visualMaxPrice}{" "}
                        <IoIosClose
                          onClick={handleCancelPrice}
                          color="black"
                          cursor={"pointer"}
                          size={21}
                        />
                      </div>
                    )}
                    {selectBrand && (
                      <div className="filter_data">
                        Brand : {selectBrand}{" "}
                        <IoIosClose
                          color="black"
                          cursor={"pointer"}
                          size={21}
                          onClick={() => handleClickBrand(selectBrand)}
                        />
                      </div>
                    )}
                    {(visualMaxPrice || visualMaxPrice || selectBrand) && (
                      <div className="clear_button" onClick={() => cancelAll()}>
                        Clear all
                      </div>
                    )}
                  </div>
                )}
                <div className="container_filter_product">
                  {loading ? (
                    <div className="loader_container main_box">
                      {[...Array(8)].map((_, index) => (
                        <div key={index} className="box loading_box">
                          <span className="loader4"></span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {filterData.length > 0 ? (
                        <>
                          {gridview && (
                            <div className="main_box">
                              {currentItems.map((product) => (
                                <Link
                                  key={product.id}
                                  style={{
                                    textDecoration: "none",
                                    color: "black",
                                  }}
                                  to={`/products/${product.id}?productId=${product.id}`}
                                >
                                  <div className="box">
                                    <div className="img-box">
                                      <img
                                        src={`${process.env.REACT_APP_ClOUD}${product.cover_image}?amp=1`}
                                        alt={product.name}
                                      />
                                    </div>

                                    <div className="detail-box">
                                      <div className="title">
                                        {product.name}
                                      </div>
                                      <div className="price_item">
                                        <span
                                          className="currency_bd"
                                          style={{ fontSize: "1.6vw" }}
                                        >
                                          ৳
                                        </span>
                                        {calculateDiscount(product) ||
                                          handlePrice(product.id)}
                                        {product.discount && (
                                          <span class="origin-block ml-3">
                                            <span class="  pdp-price_type_deleted pdp-price_color_lightgray item-price-original">
                                              <span
                                                className="currency"
                                                style={{ fontSize: "1.1vw" }}
                                              >
                                                ৳
                                              </span>{" "}
                                              {handlePrice(product.id)}
                                            </span>
                                          </span>
                                        )}
                                      </div>

                                      <div>
                                        <button className="order-now-button">
                                          Order Now
                                        </button>
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
                                  style={{
                                    textDecoration: "none",
                                    color: "black",
                                  }}
                                  to={`/products/${product.id}?productId=${product.id}`}
                                >
                                  <div className="list_box">
                                    <div className="list_img_box">
                                      <img
                                        src={`${process.env.REACT_APP_ClOUD}${product.cover_image}`}
                                        alt={product.name}
                                      />
                                    </div>
                                    <div className="list_detail-box">
                                      <div className="list_title">
                                        {product.name}
                                      </div>
                                      <div className="list_price_item">
                                        {" "}
                                        <span style={{ fontSize: "1.8vw" }}>
                                          ৳
                                        </span>{" "}
                                        {product.price}
                                      </div>
                                      {/* <div>
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
                                    </div> */}
                                      <ul class="b">
                                        <li>Produt Type:{q}</li>
                                        {/* <li>Color : Black</li> */}
                                        <li>Gender : Women</li>
                                        <li>
                                          Brand :{" "}
                                          {product.brand?.name
                                            ? product.brand.name
                                            : "No Brand"}{" "}
                                        </li>
                                      </ul>
                                      <button className="order-now-button list_view_order_button">
                                        Order Now
                                      </button>
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
                            <div className="search_resut_title">
                              Search No Result
                            </div>
                            <div className="search_resut_des">
                              We're sorry. We cannot find any matches for your
                              search term.
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        </section>
        <Footer />
      </div>
      <FooterResponsive />
    </>
  );
};

export default SubcategoryFilterProduct;
