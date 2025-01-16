import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ShoppingCartPage= () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Sushi Roll",
      price: 250,
      quantity: 1,
    },
   
  ]);

  const navigate = useNavigate();

  // Handle quantity changes
  const handleQuantityChange = (itemId, change) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  // Remove an item
  const handleRemoveItem = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemId)
    );
  };

  // Calculate total cost
  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Navigate to Checkout
  const handleProceedToCheckout = () => {
    navigate("/checkout", { state: { cartItems, total: calculateTotal() } });
  };

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-lg text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border border-gray-200 px-4 py-2">Item</th>
                <th className="border border-gray-200 px-4 py-2 text-center">
                  Price
                </th>
                <th className="border border-gray-200 px-4 py-2 text-center">
                  Quantity
                </th>
                <th className="border border-gray-200 px-4 py-2 text-center">
                  Total
                </th>
                <th className="border border-gray-200 px-4 py-2 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">
                    {item.name}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    Rs. {item.price}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    Rs. {item.price * item.quantity}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>Rs. {calculateTotal()}</span>
          </div>
          <button
            onClick={handleProceedToCheckout}
            className="w-full mt-4 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default ShoppingCartPage;
