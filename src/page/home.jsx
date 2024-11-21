import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/style.css";
import "../css/bootstrap.css";
import "../css/responsive.css";
import Navbar from "./Navbar";
import { FiChevronRight } from "react-icons/fi";
import CustomSlider from "../components/custom.slider";
import { useTranslation } from "react-i18next";
import "../components/categorycarosel.css";
import FooterResponsive from "../components/FooterResponsive";
import Slider from "react-slick";
// Import Swiper React components
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Footer from "./Footer";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(16);

  const [cartitems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, SetCategory] = useState([]);
  const [subcategories, setSubCategory] = useState([]);

  const [display, setDisplay] = useState([]);
  const [varintData, setVarinatData] = useState([]);
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1.
    },
  };
  useEffect(() => {
    sessionStorage.removeItem("redirectFrom");
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}/api/get-products/`
        );
        const data = await response.json();
        const { products, variant } = data;
        setProducts(products);
        setVarinatData(variant);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchcategory = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}/api/get-subcategory/`
        );
        const data = await response.json();
        const { categories, subcategory } = data;
        SetCategory(categories);
        setSubCategory(subcategory);
        // setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const faetchdisplaymarketing = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}/api/get-displaymarketing/`
        );
        const data = await response.json();
        const { display } = data;
        setDisplay(display);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    fetchcategory();
    faetchdisplaymarketing();
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
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
        const { cartItems } = data;
        setCartItems(cartItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (authToken) {
      fetchCartItems();
    }
  }, [authToken]);

  const handleLoadMore = () => {
    setVisibleProducts((prevVisibleProducts) => prevVisibleProducts + 8);
  };

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  let subcategoryTimeout;

  const handleCategoryMouseEnter = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleCategoryMouseLeave = () => {
    clearTimeout(subcategoryTimeout);
    setActiveCategory(null);
  };

  const handleSubcategoryMouseEnter = (subcategory) => {
    setActiveSubcategory(subcategory);
  };

  const handleSubcategoryMouseLeave = () => {
    setActiveSubcategory(null);
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

  // const shuffleArray = (array) => {
  //   for (let i = array.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [array[i], array[j]] = [array[j], array[i]];
  //   }
  //   return array;
  // };
  // const shuffledProducts = shuffleArray([...products]);
  // const [shuffledCategories, setShuffledCategories] = useState([]);

  // useEffect(() => {
  //   const shuffledCategories = shuffleArray([...categories]);
  //   setShuffledCategories(shuffledCategories);
  // }, [categories]);

  const calculateDiscount = (product) => {
    if (product?.discount) {
      const price = handlePrice(product.id);
      const discountAmount =
        (parseFloat(price) * parseFloat(product?.discount)) / 100;
      const discountedPrice = price - discountAmount;
      return Math.round(discountedPrice);
    }
  };
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };
    const timeoutId = setTimeout(scrollToTop, 100); // Adjust the delay time as needed

    return () => clearTimeout(timeoutId);
  }, []);

  const handlePrice = (id) => {
    const data = varintData.filter((item) => item.product?.id == id);
    return data[0]?.price;
  };

  return (
    <>
      <div className="sub_page">
        <Navbar cartItems={cartitems} />
        <section className="product_section ">
          <div className="category_header">
            <div className="box_elements_category">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`category-item ${
                    activeCategory === category.id ? "actives" : ""
                  }`}
                  onMouseEnter={() => handleCategoryMouseEnter(category.id)}
                  onMouseLeave={handleCategoryMouseLeave}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <span className="img_icons_category">
                      <img
                        src={`${process.env.REACT_APP_ClOUD}${category.icons}`}
                        width={16}
                        alt=""
                      />{" "}
                    </span>
                    <span style={{ marginLeft: ".4vw" }}>
                      {category.category_name}
                    </span>{" "}
                  </div>
                  {activeCategory === category.id && (
                    <div
                      className="box_elements_category_sub"
                      onMouseEnter={() =>
                        handleSubcategoryMouseEnter(category.subcategories[0])
                      }
                      onMouseLeave={handleSubcategoryMouseLeave}
                    >
                      {category.subcategories.map((subcategory, index) => (
                        <div
                          key={index}
                          className={`subcategory-item ${
                            activeSubcategory === subcategory ? "actives" : ""
                          }`}
                          onClick={() => handleSubcategoryClick(subcategory)}
                        >
                          {subcategory.subcategory_name}
                        </div>
                      ))}
                    </div>
                  )}

                  {activeCategory === category.id && (
                    <FiChevronRight className="arrow-icon" />
                  )}
                </div>
              ))}
            </div>

            <div className="box_elements_display">
              <CustomSlider>
                {display.map((img, index) => {
                  return (
                    <img
                      key={index}
                      src={`${process.env.REACT_APP_ClOUD}${img.image}`}
                      alt={img.name}
                    />
                  );
                })}
              </CustomSlider>
            </div>
          </div>

          <div className="container_product">
            <div className="categories">
              <div
                className="category_tilte"
                style={{
                  marginBottom: "1vw",
                  fontSize: "1.6vw",
                  fontFamily: "Roboto-Regular",
                  color: "#424242",
                }}
              >
                {t("category")}
              </div>
              {loading ? (
                <div className="box_elements_loading_category ">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="Loader_subcategory_item_category "
                    >
                      <span className="loader5"></span>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="box_elements_categorys  ">
                    {/* <Carousel
                      // autoPlay={true}
                      // shouldResetAutoplay={true}
                      infinite
                      ssr={true}
                      arrows ={true}
                      responsive={responsive}
                    > */}

                    {subcategories.map((subcategory, index) => (
                      <button
                        key={index}
                        style={{ outline: "none" }}
                        onClick={() => handleSubcategoryClick(subcategory)}
                      >
                        <div className="subcategory_item_category" key={index}>
                          <div className="img_box_category">
                            <img
                              width={100}
                              src={`${process.env.REACT_APP_ClOUD}${subcategory.image}`}
                              alt={subcategory.subcategory_name}
                            />
                          </div>
                          <div className="category_name">
                            {subcategory.subcategory_name}
                          </div>
                        </div>
                      </button>
                    ))}
                    {/* </Carousel> */}
                  </div>

                  <div className="courosel_responsive">
                    <Carousel
                      autoPlay
                      arrows={false}
                      infinite={true}
                      responsive={responsive}
                    >
                      {subcategories.map((subcategory, index) => (
                        <button
                          style={{ outline: "none", border: "none" }}
                          onClick={() => handleSubcategoryClick(subcategory)}
                          key={index}
                        >
                          <div className="subcategory_item_category">
                            <div className="img_box_category">
                              <img
                                src={`${process.env.REACT_APP_ClOUD}${subcategory.image}`}
                                alt={subcategory.subcategory_name}
                              />
                            </div>
                            <div className="category_name">
                              {subcategory.subcategory_name}
                            </div>
                          </div>
                        </button>
                      ))}
                    </Carousel>
                  </div>
                </>
              )}
            </div>
            <div
              className="product_header"
              style={{
                marginBottom: "1vw",
                fontSize: "1.6vw",
                fontFamily: "Roboto-Regular",
                color: "#424242",
              }}
            >
              {t("just")}
            </div>
            <div className="main_box">
              {loading ? (
                [...Array(8)].map((_, index) => (
                  <div key={index} className="box loading_box">
                    <span className="loader4"></span>
                  </div>
                ))
              ) : (
                <>
                  {products.slice(0, visibleProducts).map((product) => (
                    <Link
                      key={product.id}
                      style={{ textDecoration: "none", color: "black" }}
                      to={`/products/${encodeURIComponent(
                        product.name
                      )}?productId=${product.id}`}
                    >
                      <div className="box">
                        <div className="img-box">
                          <img
                            src={`${process.env.REACT_APP_ClOUD}${product.cover_image}?amp=1`}
                            alt={product.name}
                          />
                        </div>

                        <div className="detail-box">
                          <div className="title">{product.name}</div>
                          <div className="price_item">
                            <span
                              className="bdt_taka"
                              style={{ fontSize: "1.5vw" }}
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
                        {/* {product.discount? <div className="discount_product">-{product.discount}%</div>: ""}   */}
                      </div>
                    </Link>
                  ))}
                </>
              )}
            </div>

            <div className="Load_buuton">
              {visibleProducts < products.length && (
                <button onClick={handleLoadMore}>{t("load")}</button>
              )}
            </div>
          </div>
        </section>
        <Footer />
      </div>

      <FooterResponsive />
    </>
  );
};

export default Product;
