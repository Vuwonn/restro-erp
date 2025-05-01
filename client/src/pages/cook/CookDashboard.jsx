import { useState, useEffect } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000'); 

const CookDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [newOrderNotification, setNewOrderNotification] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, price: 0 });

  // Fetch orders (mock data for now)
  useEffect(() => {
    // Example API call or data fetch
    setOrders([
      {
        _id: { $oid: '1234' },
        customerName: 'John Doe',
        items: [{ name: 'Cheese Burger', quantity: 2, price: 8.99 }],
        orderType: 'dine-in',
        tableNumber: '1',
        subtotal: 17.98,
        status: 'pending',
        createdAt: { $date: { $numberLong: '1743760684177' } },
      },
    ]);
  }, []);

  // Real-time order updates from the server (commented out)
  // useEffect(() => {
  //   socket.on('newOrder', (order) => {
  //     setOrders((prevOrders) => [order, ...prevOrders]);
  //     setNewOrderNotification(true);
  //   });

  //   return () => socket.off('newOrder');
  // }, []);

  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order._id.$oid === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    
    // socket.emit('orderStatusUpdated', { orderId, newStatus });

    // If marking as completed, clear new order notification
    if (newStatus === 'completed') {
      setNewOrderNotification(false);
    }
  };

  const handlePrintOrder = (order) => {
    // In a real app, this would send to a printer or generate a PDF
    console.log('Printing order:', order);
    alert(`Order #${order._id.$oid.slice(-4)} sent to printer!`);
  };

  const startEditing = (order) => {
    setEditingOrder(JSON.parse(JSON.stringify(order))); // Deep copy
  };

  const cancelEditing = () => {
    setEditingOrder(null);
  };

  const saveEditedOrder = () => {
    const updatedOrders = orders.map((order) =>
      order._id.$oid === editingOrder._id.$oid ? editingOrder : order
    );
    setOrders(updatedOrders);
    
    // socket.emit('orderUpdated', editingOrder);
    
    setEditingOrder(null);
  };

  const addNewItem = () => {
    if (!newItem.name || newItem.price <= 0) return;
    
    setEditingOrder({
      ...editingOrder,
      items: [...editingOrder.items, newItem],
      subtotal: editingOrder.subtotal + (newItem.quantity * newItem.price)
    });
    
    setNewItem({ name: '', quantity: 1, price: 0 });
  };

  const removeItem = (index) => {
    const removedItem = editingOrder.items[index];
    const updatedItems = editingOrder.items.filter((_, i) => i !== index);
    
    setEditingOrder({
      ...editingOrder,
      items: updatedItems,
      subtotal: editingOrder.subtotal - (removedItem.quantity * removedItem.price)
    });
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...editingOrder.items];
    const oldValue = updatedItems[index][field];
    updatedItems[index][field] = value;
    
    let subtotalChange = 0;
    if (field === 'quantity' || field === 'price') {
      subtotalChange = (value - oldValue) * 
        (field === 'quantity' ? updatedItems[index].price : updatedItems[index].quantity);
    }
    
    setEditingOrder({
      ...editingOrder,
      items: updatedItems,
      subtotal: editingOrder.subtotal + subtotalChange
    });
  };

  const filteredOrders = orders.filter((order) => order.status === activeTab);

  return (
    <div className="max-w-3xl mx-auto bg-gray-50 p-4 rounded-lg shadow-lg">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Cook Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${newOrderNotification ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">{newOrderNotification ? 'New Order!' : 'Waiting for orders'}</span>
        </div>
      </header>

      {/* Order Tabs */}
      <nav className="flex justify-between mb-4">
        <button
          className={`px-4 py-2 font-medium text-sm rounded-l-lg ${activeTab === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => {
            setActiveTab('pending');
            setNewOrderNotification(false);
          }}
        >
          Pending ({orders.filter(o => o.status === 'pending').length})
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'in-progress' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('in-progress')}
        >
          In Progress ({orders.filter(o => o.status === 'in-progress').length})
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm rounded-r-lg ${activeTab === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({orders.filter(o => o.status === 'completed').length})
        </button>
      </nav>

      {/* New Order Notification */}
      {newOrderNotification && activeTab !== 'pending' && (
        <div className="bg-green-200 text-green-800 p-2 rounded-md mb-4 flex justify-between items-center">
          <span>New Order Received! 🛎️</span>
          <button 
            className="text-green-800 hover:text-green-900"
            onClick={() => setActiveTab('pending')}
          >
            View Pending Orders
          </button>
        </div>
      )}

      {/* Order List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No orders in this category</p>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id.$oid} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              {/* Order Header */}
              <div className="flex justify-between items-center p-4 bg-gray-100">
                <div>
                  <span className="font-semibold text-gray-800">#{order._id.$oid.slice(-4)}</span>
                  <span className="ml-2 text-sm text-gray-600">{order.customerName}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt.$date.$numberLong).toLocaleTimeString()}
                </span>
              </div>

              {/* Order Items */}
              <div className="p-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <span className="font-medium text-gray-800">{item.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-4">x{item.quantity}</span>
                      <span className="font-medium">${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-200">
                  <span className="font-medium">Subtotal:</span>
                  <span className="font-semibold">${order.subtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Order Footer */}
              <div className="flex justify-between items-center p-4 bg-gray-50">
                <span className="text-sm text-gray-600">
                  {order.orderType === 'dine-in' ? `Table ${order.tableNumber}` : 'Takeaway'}
                </span>
                
                <div className="space-x-2">
                  {order.status === 'pending' && (
                    <button
                      className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
                      onClick={() => handleStatusChange(order._id.$oid, 'in-progress')}
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === 'in-progress' && (
                    <button
                      className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600"
                      onClick={() => handleStatusChange(order._id.$oid, 'completed')}
                    >
                      Mark as Completed
                    </button>
                  )}
                  {order.status === 'completed' && (
                    <button
                      className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
                      onClick={() => handlePrintOrder(order)}
                    >
                      Print Order
                    </button>
                  )}
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300"
                    onClick={() => startEditing(order)}
                  >
                    Edit Order
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Edit Order #{editingOrder._id.$oid.slice(-4)}</h2>
              
              {/* Current Items */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Order Items</h3>
                {editingOrder.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center mb-2 p-2 bg-gray-50 rounded">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                      className="col-span-5 p-2 border rounded"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      min="1"
                      className="col-span-2 p-2 border rounded"
                    />
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      className="col-span-2 p-2 border rounded"
                    />
                    <button
                      className="col-span-3 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                      onClick={() => removeItem(index)}
                    >
                      Remove Item
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Item */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Add New Item</h3>
                <div className="grid grid-cols-12 gap-2">
                  <input
                    type="text"
                    placeholder="Item name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="col-span-5 p-2 border rounded"
                  />
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                    className="col-span-2 p-2 border rounded"
                  />
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                    className="col-span-2 p-2 border rounded"
                  />
                  <button
                    className="col-span-3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    onClick={addNewItem}
                  >
                    Add Item
                  </button>
                </div>
              </div>

              {/* Order Subtotal */}
              <div className="flex justify-between items-center mb-6">
                <span className="font-medium">Subtotal:</span>
                <span className="font-semibold">${editingOrder.subtotal.toFixed(2)}</span>
              </div>

              {/* Save and Cancel */}
              <div className="flex justify-end gap-4">
                <button
                  className="bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300"
                  onClick={cancelEditing}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                  onClick={saveEditedOrder}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookDashboard;
