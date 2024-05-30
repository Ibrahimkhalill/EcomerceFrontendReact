import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        "http://127.0.0.1:8000/api/get-subcategory/"
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
                subcategory.map((data) => (
                  <div className="category_image">
                    <img
                      src={`http://localhost:8000${data.image}`}
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
