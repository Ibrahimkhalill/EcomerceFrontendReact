import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/cart.css";
import Navbar from "./Navbar";
import image from "../images/02aa318a32d615d3be93cf5264f8e46e.jpg_300x0q75.webp";
import { ToastContainer, toast } from "react-toastify";
import updateUserOrder from "../components/UpdateCart";
import FooterResponsive from "../components/FooterResponsive";
const Category = () => {
  const authToken = localStorage.getItem("authToken");

  const [items, setItems] = useState([]);
  const [filterSubcategory, setFilterSubcategory] = useState([]);
  const [cartitems, setCartItems] = useState([]);
  const [subcategory, setSubCategory] = useState([]);
  const [category, SetCategory] = useState([]);
  const [wishlistData, setWishListData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sessionStorage.removeItem("redirectFrom");
    fetchcategory();

    fetchWishListProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchcategory = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/api/get-subcategory/`
      );
      const data = await response.json();
      const { categories, subcategory } = data;
      SetCategory(categories);
      setSubCategory(subcategory);
      setFilterSubcategory(subcategory);
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchWishListProduct = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/api/wishListProduct/getAll/`,
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
  const [activeCategory, setactiveCategory] = useState("Just For You");

  const handleFilterCategory = (name) => {
    setactiveCategory(name);
    const filter = filterSubcategory.filter(
      (item) => name === item.category?.category_name
    );
    setSubCategory(filter);
  };
  const handleAllFilterCategory = () => {
    setactiveCategory("Just For You");
    setSubCategory(filterSubcategory);
  };
  const navigate = useNavigate();
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
        <Navbar MyOrderItems={cartitems} />
        <ToastContainer autoClose={1000} />

        <div className="category_section_responsive">
          <div className="category_sidebar">
            <div
              className={`${
                activeCategory === "Just For You" ? "active_category_res" : ""
              }`}
              onClick={handleAllFilterCategory}
            >
              Just For You
            </div>
            {category &&
              category.map((data) => (
                <div
                  className={`${
                    activeCategory === data.category_name
                      ? "active_category_res"
                      : ""
                  }`}
                  onClick={() => handleFilterCategory(data.category_name)}
                >
                  {data.category_name}
                </div>
              ))}
          </div>

          <div>
            <div className="subcategory_section_responsive">
              {subcategory &&
                subcategory.map((data, index) => (
                  <div
                    className="category_image"
                    key={index}
                    onClick={() => handleSubcategoryClick(data)}
                  >
                    <img
                      src={`${process.env.REACT_APP_ClOUD}${data.image}`}
                      alt={subcategory.subcategory_name}
                    />

                    <div style={{ textAlign: "center" }}>
                      {data.subcategory_name}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <FooterResponsive wishlist={wishlistData.length} />
    </>
  );
};

export default Category;
