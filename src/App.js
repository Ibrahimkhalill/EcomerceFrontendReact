import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./authentication/SignUp.jsx";
import Login from "./authentication/Login.jsx";
import Home from "./page/Home.jsx";

import Cart from "./page/Cart.jsx";
import Checkout from "./page/Checkout.jsx";
import ProductDetails from "./page/ProductDetails.jsx";
import SearchProduct from "./page/SearchProduct.jsx";
import SubcategoryFilterProduct from "./page/SubcategoryFilterProduct.jsx";
import Footer from "./page/Footer.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={ <div>
              <Home />
              <Footer />
            </div>} />
        <Route
          path="/cart"
          element={
            <div>
              <Cart />
              <Footer />
            </div>
          }
        />
        <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/products/:id"
          element={
            <div>
              <ProductDetails />
              <Footer />
            </div>
          }
        />
        <Route path="/search-product/q=?" element={<SearchProduct />} />
        <Route
          path="/filter-product/q=?"
          element={<SubcategoryFilterProduct />}
        />
      </Routes>
    </Router>
  );
}

export default App;
