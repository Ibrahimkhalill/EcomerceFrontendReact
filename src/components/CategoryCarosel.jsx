import React, { useState } from "react";
import "./Carousel.css"; // Make sure to include your CSS

const Carousel = ({ subcategories }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < subcategories.length - 2) {
      setCurrentIndex(currentIndex + 2);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 2);
    } else {
      setCurrentIndex(subcategories.length - 2);
    }
  };

  return (
    <div className="carousel-container">
      <button className="carousel-button" onClick={handlePrevious}>
        Previous
      </button>
      <div className="carousel-wrapper">
        {subcategories.slice(currentIndex, currentIndex + 2).map((subcategory, index) => (
          <button
            key={index}
            style={{ outline: "none" }}
            
          >
            <div className="subcategory_item_category">
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
      <button className="carousel-button" onClick={handleNext}>
        Next
      </button>
    </div>
  );
};

export default Carousel;
