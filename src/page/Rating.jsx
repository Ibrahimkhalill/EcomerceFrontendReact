import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const Rating = ({ initialRating, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating);

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
    onRatingChange(selectedRating);
  };

  return (
    <div>
      {[...Array(5)].map((_, index) => (
        <FaStar
          key={index}
          className={index < rating ? 'star active' : 'star'}
          onClick={() => handleStarClick(index + 1)}
        />
      ))}
    </div>
  );
};

export default Rating;
