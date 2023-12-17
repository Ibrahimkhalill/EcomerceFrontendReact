import React from "react";
import "../style/button.css";

export default function Button({ className, children, ...rest }) {
  return (
    <button className={`button_progress ${className}`} {...rest}>
      {children}
    </button>
  );
}
