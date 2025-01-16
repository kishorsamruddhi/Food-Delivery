import React from "react";
import Navbar from './components/user/navbar';
import Hero from "./pages/user/hero";
import ContactUs from "./pages/user/contactus";
import Shop from "./pages/user/shop";
import BestSeller from "./pages/user/BestSeller";
import NewArrival from "./pages/user/NewArrival";
import Login from "./pages/user/login";
import Signup from "./pages/user/signup";
import { AuthProvider } from "./context/AuthContext";
import ShoppingCartPage from "./pages/user/cart";
import ProductDetails from "./pages/user/productDetails"; 
// import Dashboard from './components/Dashboard';
import Dashboard from "./components/admin/dashboard";

import OrderStatusBadge from "./components/admin/order";
import Checkout from "./pages/user/checkout";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

const App = () => {
  return (
    <Router>  {/* Wrap your app with BrowserRouter */}
    <AuthProvider>
      <div>
        <Navbar /> 
        <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/best-sellers" element={<BestSeller />} />
        <Route path="/new-arrivals" element={<NewArrival />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<ShoppingCartPage />} />
        <Route path="productDetails" element={<ProductDetails />} />
        {/* <Route path="/:productId" element={<productDetails />} /> */}
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/order" element={<OrderStatusBadge />} />
        


        </Routes>
      </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
