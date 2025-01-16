import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voucher, setVoucher] = useState("");
  const [discountInfo, setDiscountInfo] = useState({
    code: "",
    percentage: 0,
    message: "",
  });

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        // Fetch data from the meal API instead of the backend
        const mealResponse = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=`
        );
        const mealData = await mealResponse.json();

        if (!mealData.meals) {
          setError("No meals found");
          setLoading(false);
          return;
        }

        const products = mealData.meals.map((meal) => ({
          idMeal: meal.idMeal,
          name: meal.strMeal,
          description: meal.strInstructions,
          price: "Rs. 100", // Mock price
          img: meal.strMealThumb,
          quantity: 1,
        }));

        setCartItems(products);
        setLoading(false);
      } catch (err) {
        setError("Error fetching cart items");
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleQuantityChange = async (itemId, change) => {
    const item = cartItems.find((item) => item.idMeal === itemId);
    const newQuantity = item.quantity + change;

    if (newQuantity >= 1) {
      const updatedItems = cartItems.map((item) => {
        if (item.idMeal === itemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setCartItems(updatedItems);
    }
  };

  const handleRemoveItem = (itemId) => {
    const updatedItems = cartItems.filter((item) => item.idMeal !== itemId);
    setCartItems(updatedItems);
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => {
      return (
        total + parseFloat(item.price.replace(/[^\d.]/g, "")) * item.quantity
      );
    }, 0);
    const discountedTotal = subtotal * (1 - discountInfo.percentage / 100);
    return discountedTotal.toFixed(2);
  };

  const handleVoucherRedeem = async () => {
    try {
      // Simulate the voucher API
      if (voucher === "DISCOUNT10") {
        setDiscountInfo({
          code: voucher,
          percentage: 10,
          message: "10% discount applied!",
        });
      } else {
        setDiscountInfo({
          code: "",
          percentage: 0,
          message: "Invalid coupon code",
        });
      }
    } catch (err) {
      console.error("Error verifying coupon:", err);
      setDiscountInfo({
        code: "",
        percentage: 0,
        message: "Error verifying coupon",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-black-600"></div>
      </div>
    );
  }

  if (error || cartItems.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center">
        <div className="w-48 h-48 mb-4 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-4xl">🛒</span>
        </div>
        <p className="text-lg text-gray-600 mb-4">
          {error || "Your cart is empty"}
        </p>
        <Link
          to="/shop"
          className="px-4 py-2 bg-black-500 text-white rounded-md hover:bg-black-600 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
        </div>
        <div className="p-4 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.idMeal}
              className="flex flex-col md:flex-row items-center justify-between border-b pb-4 last:border-b-0"
            >
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full">
                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
                  <div>
                    <h3 className="font-semibold text-base">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full mt-4 md:mt-0">
                    <span className="font-medium text-base">
                      Rs. {item.price}
                    </span>

                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => handleQuantityChange(item.idMeal, -1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={item.quantity}
                        readOnly
                        className="w-12 text-center border-none text-sm"
                      />
                      <button
                        onClick={() => handleQuantityChange(item.idMeal, 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-medium text-base">
                      Rs.{" "}
                      {(
                        parseFloat(item.price.replace(/[^\d.]/g, "")) *
                        (item.quantity || 1)
                      ).toFixed(2)}
                    </span>

                    <button
                      onClick={() => handleRemoveItem(item.idMeal)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
            <input
              type="text"
              placeholder="Enter voucher code"
              value={voucher}
              onChange={(e) => setVoucher(e.target.value)}
              className="flex-grow border rounded-md px-3 py-2"
            />
            <button
              className="w-full md:w-auto bg-black-500 text-black px-4 py-2 rounded-md hover:bg-black-600"
              onClick={handleVoucherRedeem}
            >
              Redeem
            </button>
          </div>

          {discountInfo.message && (
            <div
              className={`text-sm ${
                discountInfo.code ? "text-green-600" : "text-red-600"
              }`}
            >
              {discountInfo.message}
            </div>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex flex-col md:flex-row justify-between">
              <span>Subtotal</span>
              <span>
                Rs.{" "}
                {cartItems
                  .reduce(
                    (total, item) =>
                      total +
                      parseFloat(item.price.replace(/[^\d.]/g, "")) *
                        (item.quantity || 1),
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
            {discountInfo.percentage > 0 && (
              <div className="flex flex-col md:flex-row justify-between text-green-600">
                <span>Discount ({discountInfo.percentage}%)</span>
                <span>
                  - Rs.{" "}
                  {(
                    cartItems.reduce(
                      (total, item) =>
                        total +
                        parseFloat(item.price.replace(/[^\d.]/g, "")) *
                          (item.quantity || 1),
                      0
                    ) *
                    (discountInfo.percentage / 100)
                  ).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex flex-col md:flex-row justify-between">
              <span>Shipping</span>
              <span>Rs. 0.00</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between font-bold text-base">
              <span>Total</span>
              <span>Rs. {calculateTotal()}</span>
            </div>
          </div>

          <Link
            to={"/checkout"}
            state={{
              total: calculateTotal(),
              discount: discountInfo.percentage,
            }}
            className="block"
          >
            <button className="w-full bg-black-500  py-2 rounded-md bg-black text-white">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
