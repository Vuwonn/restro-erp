import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiPrinter, 
  FiAlertTriangle, 
  FiEdit2, 
  FiPlus, 
  FiMinus,
  FiSave,
  FiX
} from "react-icons/fi";
import { ORDER_API_END_POINT } from "@/utils/constant";

const OrderDetails = () => {
  const { tableNumber } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editableOrders, setEditableOrders] = useState([]);
  const [customItems, setCustomItems] = useState([]);
  const [newCustomItem, setNewCustomItem] = useState({
    name: "",
    price: 0,
    quantity: 1,
    specialInstructions: ""
  });
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "Gourmet Restaurant",
    address: "123 Food Street, Culinary City",
    phone: "(123) 456-7890",
    taxId: "TAX-123456789",
    footerMessage: "Thank you for dining with us!"
  });

  useEffect(() => {
    if (!tableNumber) {
      setError("Missing table number");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${ORDER_API_END_POINT}/orders/active?tableNumber=${tableNumber}`);
        const data = await res.json();

        if (res.ok) {
          setOrders(data.orders || []);
          setEditableOrders(JSON.parse(JSON.stringify(data.orders || [])));
        } else {
          setError(data.message || "Failed to fetch order details");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [tableNumber]);

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    
    const printStyle = `
      @media print {
        body {
          font-family: Arial, sans-serif;
          line-height: 1.4;
          color: #000;
          background: #fff;
        }
        .no-print {
          display: none !important;
        }
        .print-header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 2px dashed #000;
          padding-bottom: 15px;
        }
        .bill-item {
          page-break-inside: avoid;
        }
        .bill-totals {
          page-break-inside: avoid;
        }
        .bill-footer {
          margin-top: 30px;
          text-align: center;
          font-size: 0.9em;
        }
        .edit-controls {
          display: none !important;
        }
      }
    `;
    
    document.body.innerHTML = `
      <style>${printStyle}</style>
      <div class="print-container">${printContents}</div>
    `;
    
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const getOrderSubtotal = (order) => {
    return (order.items || []).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const getCustomItemsTotal = () => {
    return customItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const grandTotal = [...orders, ...(isEditing ? [] : customItems.map(item => ({ items: [item] })))].reduce(
    (sum, order) => sum + getOrderSubtotal(order), 
    0
  ) + (isEditing ? 0 : getCustomItemsTotal());

  const currentDate = new Date().toLocaleString();

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditableOrders(JSON.parse(JSON.stringify(orders)));
    }
  };

  const handleItemQuantityChange = (orderIndex, itemIndex, newQuantity) => {
    const updatedOrders = [...editableOrders];
    updatedOrders[orderIndex].items[itemIndex].quantity = Math.max(1, newQuantity);
    setEditableOrders(updatedOrders);
  };

  const handleRemoveItem = (orderIndex, itemIndex) => {
    const updatedOrders = [...editableOrders];
    updatedOrders[orderIndex].items.splice(itemIndex, 1);
    
    // Remove order if no items left
    if (updatedOrders[orderIndex].items.length === 0) {
      updatedOrders.splice(orderIndex, 1);
    }
    
    setEditableOrders(updatedOrders);
  };

  const handleAddCustomItem = () => {
    if (newCustomItem.name && newCustomItem.price > 0) {
      setCustomItems([...customItems, {...newCustomItem}]);
      setNewCustomItem({
        name: "",
        price: 0,
        quantity: 1,
        specialInstructions: ""
      });
    }
  };

  const handleRemoveCustomItem = (index) => {
    const updatedItems = [...customItems];
    updatedItems.splice(index, 1);
    setCustomItems(updatedItems);
  };

  const handleSaveChanges = async () => {
    try {
      // In a real app, you would send this to your API to update the orders
      setOrders(editableOrders);
      setIsEditing(false);
      // Show success message
      alert("Bill updated successfully!");
    } catch (err) {
      console.error("Error saving changes:", err);
      alert("Failed to save changes");
    }
  };

  const handleRestaurantInfoChange = (field, value) => {
    setRestaurantInfo({
      ...restaurantInfo,
      [field]: value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <div className="max-w-md bg-white rounded-lg shadow p-6">
          <FiAlertTriangle className="text-red-500 text-3xl mx-auto mb-2" />
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/admin/orders")}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-6 no-print">
        <button
          onClick={() => navigate("/admin/orders")}
          className="flex items-center text-gray-700 hover:text-indigo-600"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>
        <div className="flex space-x-2">
          <button
            onClick={toggleEdit}
            className={`flex items-center px-4 py-2 rounded ${
              isEditing 
                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            <FiEdit2 className="mr-2" /> {isEditing ? "Cancel Edit" : "Edit Bill"}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            <FiPrinter className="mr-2" /> Print Bill
          </button>
          {isEditing && (
            <button
              onClick={handleSaveChanges}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              <FiSave className="mr-2" /> Save Changes
            </button>
          )}
        </div>
      </div>

      <div ref={printRef} className="max-w-2xl mx-auto bg-white p-6 shadow-sm">
        {/* Restaurant Header - Editable in edit mode */}
        <div className="print-header">
          {isEditing ? (
            <div className="mb-4">
              <input
                type="text"
                value={restaurantInfo.name}
                onChange={(e) => handleRestaurantInfoChange('name', e.target.value)}
                className="text-3xl font-bold mb-1 w-full text-center border-b border-gray-300"
              />
              <input
                type="text"
                value={restaurantInfo.address}
                onChange={(e) => handleRestaurantInfoChange('address', e.target.value)}
                className="text-sm w-full text-center border-b border-gray-300"
              />
              <input
                type="text"
                value={restaurantInfo.phone}
                onChange={(e) => handleRestaurantInfoChange('phone', e.target.value)}
                className="text-sm w-full text-center border-b border-gray-300"
              />
              <input
                type="text"
                value={restaurantInfo.taxId}
                onChange={(e) => handleRestaurantInfoChange('taxId', e.target.value)}
                className="text-sm mt-2 font-medium w-full text-center border-b border-gray-300"
              />
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-1">{restaurantInfo.name}</h1>
              <p className="text-sm">{restaurantInfo.address}</p>
              <p className="text-sm">Tel: {restaurantInfo.phone}</p>
              <p className="text-sm mt-2 font-medium">TAX ID: {restaurantInfo.taxId}</p>
            </>
          )}
        </div>

        {/* Order Info */}
        <div className="mb-6 border-b pb-4">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">Table: <span className="font-normal">#{tableNumber}</span></p>
              <p className="font-semibold">Date: <span className="font-normal">{currentDate}</span></p>
            </div>
            <div className="text-right">
              <p className="font-semibold">Bill No: <span className="font-normal">#{orders[0]?._id.slice(-6) || 'N/A'}</span></p>
              <p className="font-semibold">Staff: <span className="font-normal">Admin</span></p>
            </div>
          </div>
        </div>

        {orders.length === 0 && customItems.length === 0 ? (
          <p className="text-center py-8">No active orders for this table.</p>
        ) : (
          <>
            {/* Order Items */}
            <div className="mb-6">
              <div className="grid grid-cols-12 gap-2 font-bold border-b pb-2 mb-2">
                <div className="col-span-6">Item</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {(isEditing ? editableOrders : orders).map((order, orderIndex) => (
                <div key={order._id || orderIndex} className="bill-item mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Order #{order._id?.slice(-6) || `CUST-${orderIndex + 1}`}</span>
                    {isEditing && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        order.status === "Pending" ? "bg-yellow-100" :
                        order.status === "In Progress" ? "bg-blue-100" :
                        order.status === "Completed" ? "bg-green-100" : "bg-gray-100"
                      }`}>
                        {order.status}
                      </span>
                    )}
                  </div>
                  
                  {(order.items || []).map((item, itemIndex) => (
                    <div key={`${item.name}-${itemIndex}`} className="grid grid-cols-12 gap-2 py-1 items-center">
                      <div className="col-span-6">
                        {isEditing ? (
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              const updatedOrders = [...editableOrders];
                              updatedOrders[orderIndex].items[itemIndex].name = e.target.value;
                              setEditableOrders(updatedOrders);
                            }}
                            className="w-full border-b border-gray-300"
                          />
                        ) : (
                          item.name
                        )}
                        {item.specialInstructions && (
                          <p className="text-xs text-gray-500">
                            Note: {isEditing ? (
                              <input
                                type="text"
                                value={item.specialInstructions}
                                onChange={(e) => {
                                  const updatedOrders = [...editableOrders];
                                  updatedOrders[orderIndex].items[itemIndex].specialInstructions = e.target.value;
                                  setEditableOrders(updatedOrders);
                                }}
                                className="w-full border-b border-gray-300"
                              />
                            ) : (
                              item.specialInstructions
                            )}
                          </p>
                        )}
                      </div>
                      <div className="col-span-2 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center">
                            <button 
                              onClick={() => handleItemQuantityChange(orderIndex, itemIndex, item.quantity - 1)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <FiMinus size={14} />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemQuantityChange(orderIndex, itemIndex, parseInt(e.target.value) || 1)}
                              className="w-10 text-center mx-1 border-b border-gray-300"
                              min="1"
                            />
                            <button 
                              onClick={() => handleItemQuantityChange(orderIndex, itemIndex, item.quantity + 1)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                        ) : (
                          item.quantity
                        )}
                      </div>
                      <div className="col-span-2 text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => {
                              const updatedOrders = [...editableOrders];
                              updatedOrders[orderIndex].items[itemIndex].price = parseFloat(e.target.value) || 0;
                              setEditableOrders(updatedOrders);
                            }}
                            className="w-full text-right border-b border-gray-300"
                            step="0.01"
                            min="0"
                          />
                        ) : (
                          `$${item.price.toFixed(2)}`
                        )}
                      </div>
                      <div className="col-span-2 text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveItem(orderIndex, itemIndex)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <FiX size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="grid grid-cols-12 gap-2 border-t pt-2 mt-2">
                    <div className="col-span-10 text-right font-semibold">Subtotal:</div>
                    <div className="col-span-2 text-right font-semibold">
                      ${getOrderSubtotal(order).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}

              {/* Custom Items (only shown when not editing) */}
              {!isEditing && customItems.length > 0 && (
                <div className="bill-item mb-4">
                  <div className="font-semibold mb-2">Additional Items</div>
                  {customItems.map((item, index) => (
                    <div key={`custom-${index}`} className="grid grid-cols-12 gap-2 py-1">
                      <div className="col-span-6">
                        {item.name}
                        {item.specialInstructions && (
                          <p className="text-xs text-gray-500">Note: {item.specialInstructions}</p>
                        )}
                      </div>
                      <div className="col-span-2 text-center">{item.quantity}</div>
                      <div className="col-span-2 text-right">${item.price.toFixed(2)}</div>
                      <div className="col-span-2 text-right">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                  <div className="grid grid-cols-12 gap-2 border-t pt-2 mt-2">
                    <div className="col-span-10 text-right font-semibold">Subtotal:</div>
                    <div className="col-span-2 text-right font-semibold">
                      ${getCustomItemsTotal().toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Add Custom Item Form (only in edit mode) */}
            {isEditing && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3">Add Custom Item</h3>
                <div className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                    <input
                      type="text"
                      value={newCustomItem.name}
                      onChange={(e) => setNewCustomItem({...newCustomItem, name: e.target.value})}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      placeholder="Item name"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      value={newCustomItem.price}
                      onChange={(e) => setNewCustomItem({...newCustomItem, price: parseFloat(e.target.value) || 0})}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                    <input
                      type="number"
                      value={newCustomItem.quantity}
                      onChange={(e) => setNewCustomItem({...newCustomItem, quantity: parseInt(e.target.value) || 1})}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      min="1"
                    />
                  </div>
                  <div className="col-span-3">
                    <button
                      onClick={handleAddCustomItem}
                      className="w-full bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center justify-center"
                    >
                      <FiPlus className="mr-1" /> Add Item
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                  <input
                    type="text"
                    value={newCustomItem.specialInstructions}
                    onChange={(e) => setNewCustomItem({...newCustomItem, specialInstructions: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    placeholder="Any special instructions"
                  />
                </div>

                {/* Display added custom items for editing */}
                {customItems.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Custom Items</h4>
                    {customItems.map((item, index) => (
                      <div key={`edit-custom-${index}`} className="flex items-center justify-between py-2 border-b">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          {item.specialInstructions && (
                            <span className="text-xs text-gray-500 ml-2">({item.specialInstructions})</span>
                          )}
                        </div>
                        <div className="flex items-center">
                          <span className="mr-4">${item.price.toFixed(2)} × {item.quantity}</span>
                          <button
                            onClick={() => handleRemoveCustomItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Grand Total */}
            <div className="bill-totals border-t-2 border-dashed pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Grand Total:</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-6 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold mb-1">Payment Method:</p>
                  <p className="border-b pb-1">[ ] Cash</p>
                  <p className="border-b pb-1">[ ] Credit Card</p>
                  <p className="border-b pb-1">[ ] Mobile Payment</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Amount Received:</p>
                  <p className="border-b pb-1">$_________</p>
                  <p className="font-semibold mt-2">Change:</p>
                  <p className="border-b pb-1">$_________</p>
                </div>
              </div>
            </div>

            {/* Footer - Editable in edit mode */}
            <div className="bill-footer mt-8 pt-4 border-t text-sm">
              {isEditing ? (
                <textarea
                  value={restaurantInfo.footerMessage}
                  onChange={(e) => handleRestaurantInfoChange('footerMessage', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                  rows="2"
                />
              ) : (
                <>
                  <p className="mb-1">{restaurantInfo.footerMessage}</p>
                  <p className="mt-4 text-xs">* This is a computer generated bill *</p>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;