import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import useCart from "@/hooks/custumer/useCart";
import { FiX } from "react-icons/fi";

const GuestOrderPage = () => {
  const { tableId } = useParams(); 
  const navigate = useNavigate();

  const {
    cart,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItems,
  } = useCart();

  const handleConfirmOrder = () => {
    // You can also include tableId in your backend order payload
    console.log("Order confirmed for table:", tableId);
    // navigate to confirmation page or order summary
    navigate("/thank-you");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white px-4 py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-bold">
            Guest Order - Table {tableId}
          </h2>
          <button
            onClick={() => navigate("/")}
            className="text-white hover:text-indigo-200"
          >
            <FiX size={24} />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600">
              Your cart is empty
            </h3>
            <p className="text-gray-500 mt-2 text-sm">
              Add items to your cart from the menu
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Your Order ({totalItems} items)
            </h3>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-white rounded-lg shadow-sm p-4"
                >
                  <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={item?.image?.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-semibold text-gray-800">
                        {item.name}
                      </h4>
                      <span className="text-sm font-bold text-indigo-600">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between mt-2 items-center">
                      <div className="flex items-center border rounded-md">
                        <button
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="text-sm text-red-500 hover:text-red-700"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4 flex justify-between text-lg font-semibold">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <button
              onClick={handleConfirmOrder}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg mt-6 font-medium"
            >
              Confirm Order
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default GuestOrderPage;
