import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBox, FaExclamationCircle, FaWarehouse, FaShippingFast, FaTag, FaMinus, FaPlus, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Helmet } from "react-helmet";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [stockStatus, setStockStatus] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showPopup, setShowPopup] = useState(false);  // Modal visibility state

  useEffect(() => {
    // Fetch product details from API (replace with actual API)
    const fetchProductDetails = async () => {
      try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
        const data = await response.json();

        if (data && data.meals) {
          // Assume the first result is the product
          const productData = data.meals[0];
          setProduct(productData);
          setSelectedImage(productData.strMealThumb);  // Image from the API
          calculateStockStatus(productData);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductDetails();

    // Mock reviews data (you can replace this later with actual reviews)
    setReviews([
      { id: 1, user: "John Doe", rating: 5, comment: "Great product!" },
      { id: 2, user: "Jane Smith", rating: 4, comment: "Good value for money." },
    ]);
  }, [productId]);

  const calculateStockStatus = (productData) => {
    // Since the meal data doesn't have stock info, we will use a placeholder
    const stock = 20;  // Example value for stock
    let status = '';
    let color = '';

    if (stock > 50) {
      status = 'In Stock';
      color = 'bg-green-100 text-green-600';
    } else if (stock > 10) {
      status = 'Low Stock';
      color = 'bg-yellow-100 text-yellow-600';
    } else if (stock > 0) {
      status = 'Very Low Stock';
      color = 'bg-orange-100 text-orange-600';
    } else {
      status = 'Out of Stock';
      color = 'bg-red-100 text-red-600';
    }

    setStockStatus({ status, color, stock });
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (stockStatus?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };



  const handleAddToCart = () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      navigate('/cart'); // Redirect to the cart page instead of login
      return;
    }
  
    if (stockStatus?.stock === 0) {
      toast.error('Sorry, this product is currently out of stock');
      return;
    }
  
    const validQuantity = parseInt(quantity, 10);
    if (isNaN(validQuantity) || validQuantity <= 0) {
      toast.error('Invalid quantity');
      return;
    }
  
    const productToAdd = {
      id: productId,
      name: product.strMeal,
      price: 999, // Placeholder for the product price, replace with actual price
      quantity: validQuantity,
      image: product.strMealThumb, // Image of the product
    };
  
    // Retrieve existing cart or initialize an empty cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if the product already exists in the cart
    const existingProductIndex = cart.findIndex(item => item.id === productToAdd.id);
    
    if (existingProductIndex !== -1) {
      // Update quantity if the product already exists
      cart[existingProductIndex].quantity += validQuantity;
    } else {
      // Add new product to the cart
      cart.push(productToAdd);
    }
  
    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  
    toast.success('Product added to cart');
    setShowPopup(true); // Show the popup/modal
  
    // Navigate to the cart page after adding the product
    navigate('/cart');
  };

  const closeModal = () => {
    setShowPopup(false);  // Close the modal
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
          className="w-16 h-16 border-4 border-t-4 border-t-red-600 border-red-200 rounded-full"
        />
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-red-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Product Image Section */}
              <div className="p-8 bg-gray-50 flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-full max-w-md h-[500px] relative"
                >
                  <img
                    src={selectedImage}
                    alt={product.strMeal}
                    className="absolute inset-0 w-full h-full object-contain rounded-2xl shadow-lg"
                  />
                </motion.div>
              </div>

              {/* Product Info Section */}
              <div className="p-8 space-y-6">
                <div className="border-b border-red-100 pb-6">
                  <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-red-600 to-pink-500 text-transparent bg-clip-text">
                    {product.strMeal}
                  </h1>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-semibold text-red-600">
                      ₹999  {/* Placeholder for price */}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={star <= 4 ? "text-yellow-500" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(4.5)</span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className={`px-4 py-2 rounded-full flex items-center ${stockStatus?.color}`}>
                    <FaBox className="mr-2" />
                    <span className="font-medium">
                      {stockStatus?.status} ({stockStatus?.stock} available)
                    </span>
                  </div>
                  <div className="bg-red-50 px-4 py-2 rounded-full flex items-center">
                    <FaTag className="mr-2 text-red-500" />
                    <span className="font-medium text-red-600">
                      {product.strCategory}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 py-6">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="bg-red-600 text-white px-4 py-2 rounded-full disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <FaMinus />
                  </button>
                  <span className="text-xl font-medium text-gray-700">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="bg-red-600 text-white px-4 py-2 rounded-full disabled:opacity-50"
                    disabled={quantity >= stockStatus?.stock}
                  >
                    <FaPlus />
                  </button>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold text-center mb-4">Product Added to Cart</h2>
            <div className="text-center">
              <button
                onClick={closeModal}
                className="w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
