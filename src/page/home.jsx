import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/style.css";
import "../css/bootstrap.css";
import "../css/responsive.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Star from "../images/star.png";
import Loader from "./Loader";
import { FiChevronRight } from "react-icons/fi";
import CustomSlider from "../components/custom.slider";
import { useTranslation } from "react-i18next";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(16);

  const [cartitems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, SetCategory] = useState([]);
  const [subcategories, setSubCategory] = useState([]);

  const [display, setDisplay] = useState([]);
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {

    sessionStorage.removeItem("redirectFrom")
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://127.0.0.1:8000/api/get-products/");
        const data = await response.json();
        const { products } = data;
        setProducts(products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchcategory = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://127.0.0.1:8000/api/get-subcategory/"
        );
        const data = await response.json();
        const { categories, subcategory } = data;
        SetCategory(categories);
        setSubCategory(subcategory);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const faetchdisplaymarketing = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://127.0.0.1:8000/api/get-displaymarketing/"
        );
        const data = await response.json();
        const { display } = data;
        setDisplay(display);
        setLoading(false);
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
        const response = await fetch("http://127.0.0.1:8000/api/cart-items/", {
          headers: {
            "Content-type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        });
        const data = await response.json();
        const { cartItems } = data;
        setCartItems(cartItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCartItems();
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
        "http://127.0.0.1:8000/api/get-subcategory-product/",
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

  return (
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
                      src={`http://localhost:8000${category.icons}`}
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
                    src={`http://localhost:8000${img.image}`}
                    alt={img.name}
                  />
                );
              })}
            </CustomSlider>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="container_product">
            <div className="categories">
              <div
                className="div"
                style={{
                  marginBottom: "1vw",
                  fontSize: "1.6vw",
                  fontFamily: "Roboto-Regular",
                  color: "#424242",
                }}
              >
                {t("category")}
              </div>
              <div className="box_elements_categorys">
                {subcategories.map((subcategory, index) => (
                  <button
                    style={{ outline: "none" }}
                    onClick={() => handleSubcategoryClick(subcategory)}
                  >
                    <div className="subcategory_item_category" key={index}>
                      <div className="img_box_category">
                        <img
                          width={100}
                          src={`http://localhost:8000${subcategory.image}`}
                          alt={subcategory.subcategory_name}
                        />
                      </div>
                      <div className="category_name">
                        {subcategory.subcategory_name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div
              className="div"
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
              {products.slice(0, visibleProducts).map((product) => (
                <Link
                  key={product.id}
                  style={{ textDecoration: "none", color: "black" }}
                  to={`/products/${product.name}?productId=${product.id}`}
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
                        <span style={{ fontSize: "1.8vw" }}>৳</span>
                        {product.price}
                      </div>
                      <div>
                        <button className="order-now-button">Order Now</button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="Load_buuton">
              {visibleProducts < products.length && (
                <button onClick={handleLoadMore}>{t("load")}</button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Product;
