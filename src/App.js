import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signup from "./authentication/SignUp.jsx";
import Login from "./authentication/Login.jsx";
import Home from "./page/Home.jsx";

import Cart from "./page/Cart.jsx";
import Checkout from "./page/Checkout.jsx";
import ProductDetails from "./page/ProductDetails.jsx";
import SearchProduct from "./page/SearchProduct.jsx";
import SubcategoryFilterProduct from "./page/SubcategoryFilterProduct.jsx";
import Footer from "./page/Footer.jsx";
import MyOrder from "./page/MyOrder.jsx";
import MyWishlist from "./page/MyWishlist.jsx";
import MyProfile from "./page/MyProfile.jsx";
import ForgetPassword from "./authentication/ForgetPassword.jsx";
import Category from "./page/Category.jsx";
import Navbar from "./page/Navbar.jsx";
import OrderConfirm from "./page/OrderConfirm.jsx";
import { AuthProvider, useAuth } from "./components/Auth.js";


function App() {
  const authToken = localStorage.getItem("authToken");

  return (
    <Router>
      <AuthProvider>
        <Routes>
       
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user/forget-password" element={<ForgetPassword />} />
          <Route
            path="/"
            element={
              <div>
                <Home />
                {/* <Footer /> */}
              </div>
            }
          />
          <Route
            path="/cart"
            element={
              <div>
                <ProtectedRoute component={<Cart />} />
                <Footer />
              </div>
            }
          />
          <Route
            path="/checkout"
            element={
              <div>
                <ProtectedRoute component={<Checkout />} />

                <Footer />
              </div>
            }
          />
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
          <Route
            path="/account/my-order"
            element={
              <div>
                <ProtectedRoute component={<MyOrder />} />
                <Footer />
              </div>
            }
          />
          <Route
            path="/account/my-wishlist"
            element={
              <div>
                <ProtectedRoute component={<MyWishlist />} />

                <Footer />
              </div>
            }
          />
          <Route
            path="/account/my-profile"
            element={
              <div>
                <ProtectedRoute component={<MyProfile />} />
                <Footer />
              </div>
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <div>
                <ProtectedRoute component={<OrderConfirm />} />
                <Footer />
              </div>
            }
          />
          <Route
            path="/landingpage/category"
            element={
              <div>
                <Category />
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
const ProtectedRoute = ({ component }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? component : <Navigate to="/login" replace />;
};
export default App;
