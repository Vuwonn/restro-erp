import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ORDER_API_END_POINT } from '@/utils/constant';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderTypeFilter, setOrderTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('day');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [billData, setBillData] = useState(null);
  const billRef = useRef(null);

  // Debugging: Log billRef to ensure it's assigned
  useEffect(() => {
    if (billData) {
      console.log('billRef.current:', billRef.current);
    }
  }, [billData]);

  // Print handler using window.print()
  const handlePrint = () => {
    if (!billData) {
      console.error('No bill data available');
      alert('Please generate a bill first');
      return;
    }
    if (!billRef.current) {
      console.error('billRef.current is not assigned');
      alert('Cannot print: Bill content is not ready');
      return;
    }
    window.print();
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${ORDER_API_END_POINT}/orders/filter`);
      const sortedOrders = Array.isArray(data.orders)
        ? [...data.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];
      setOrders(sortedOrders);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChangeStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${ORDER_API_END_POINT}/orders/${orderId}`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleSendToKOT = async (orderId) => {
    try {
      await axios.put(`${ORDER_API_END_POINT}/orders/${orderId}/send-to-kot`);
      const updatedOrder = orders.find((o) => o._id === orderId);
      if (!updatedOrder) return;

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, sentToKOT: true } : order
        )
      );

      setBillData({
        customer: updatedOrder.customerName,
        table: updatedOrder.tableNumber,
        orderType: updatedOrder.orderType,
        orders: [updatedOrder],
        total: (updatedOrder.subtotal || 0).toFixed(2),
      });

      alert('Order sent to KOT and bill generated');
    } catch (err) {
      console.error('Error sending to KOT', err);
    }
  };

  const handleGenerateBill = (order) => {
    const groupedOrders = orders.filter(
      (o) =>
        o.orderType === order.orderType &&
        o.customerName === order.customerName &&
        (order.orderType === 'dine-in' ? o.tableNumber === order.tableNumber : true)
    );

    const totalAmount = groupedOrders.reduce((sum, o) => sum + (o.subtotal || 0), 0);

    setBillData({
      customer: order.customerName,
      table: order.tableNumber,
      orderType: order.orderType,
      orders: groupedOrders,
      total: totalAmount.toFixed(2),
    });
  };

  const filterByDate = (createdAt) => {
    const orderDate = new Date(createdAt);
    const now = new Date();

    if (dateFilter === 'day') {
      return orderDate.toDateString() === now.toDateString();
    } else if (dateFilter === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return orderDate >= oneWeekAgo;
    } else if (dateFilter === 'month') {
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    } else if (dateFilter === 'year') {
      return orderDate.getFullYear() === now.getFullYear();
    }
    return true;
  };

  const filteredOrders = (orders || [])
    .filter(
      (order) =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.tableNumber && order.tableNumber.toString().includes(searchTerm))
    )
    .filter((order) => orderTypeFilter === 'all' || order.orderType === orderTypeFilter)
    .filter((order) => statusFilter === 'all' || order.status === statusFilter)
    .filter((order) => filterByDate(order.createdAt));

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #bill-content,
            #bill-content * {
              visibility: visible;
            }
            #bill-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 20px;
              background: white;
              box-shadow: none;
            }
            .no-print {
              display: none;
            }
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Order Management</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by customer, type, or table..."
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="w-full p-3 border rounded-lg"
            value={orderTypeFilter}
            onChange={(e) => setOrderTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="dine-in">Dine-In</option>
            <option value="delivery">Delivery</option>
            <option value="takeaway">Takeaway</option>
          </select>
          <select
            className="w-full p-3 border rounded-lg"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <select
            className="w-full p-3 border rounded-lg"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border">#</th>
                  <th className="py-2 px-4 border">Customer</th>
                  <th className="py-2 px-4 border">Type</th>
                  <th className="py-2 px-4 border">Table</th>
                  <th className="py-2 px-4 border">Items</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Payment</th>
                  <th className="py-2 px-4 border">Amount</th>
                  <th className="py-2 px-4 border">Time</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={order._id} className="text-center hover:bg-gray-50">
                    <td className="py-2 px-4 border">{index + 1}</td>
                    <td className="py-2 px-4 border">{order.customerName || 'Guest'}</td>
                    <td className="py-2 px-4 border">{order.orderType}</td>
                    <td className="py-2 px-4 border">{order.tableNumber || '-'}</td>
                    <td className="py-2 px-4 border text-left max-w-xs overflow-y-auto">
                      {order.items?.map((item, i) => (
                        <div key={i}>
                          {item.quantity}x {item.name} - Rs.{item.price}
                        </div>
                      ))}
                    </td>
                    <td className="py-2 px-4 border">{order.status}</td>
                    <td className="py-2 px-4 border">{order.paymentMethod}</td>
                    <td className="py-2 px-4 border text-green-600 font-semibold">
                      Rs.{order.subtotal?.toFixed(2) || '0.00'}
                    </td>
                    <td className="py-2 px-4 border text-xs">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2 px-4 border">
                      <select
                        className="p-1 mb-2 w-full"
                        value={order.status}
                        onChange={(e) => handleChangeStatus(order._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="delivered">Delivered</option>
                      </select>

                      {order.sentToKOT ? (
                        <button
                          disabled
                          className="bg-gray-400 text-white px-2 py-1 rounded text-xs w-full mb-1 cursor-not-allowed"
                        >
                          Sent to KOT
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSendToKOT(order._id)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded text-xs w-full mb-1"
                        >
                          Send to KOT
                        </button>
                      )}

                      <button
                        onClick={() => handleGenerateBill(order)}
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs w-full"
                      >
                        Generate Bill
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Bill Modal */}
        {billData && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 no-print">
            <div
              id="bill-content"
              ref={billRef}
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
            >
              <button
                className="absolute top-2 right-3 text-xl font-bold text-gray-500 no-print"
                onClick={() => setBillData(null)}
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4 text-center">Bill Summary</h2>
              <p><strong>Customer:</strong> {billData.customer}</p>
              {billData.orderType === 'dine-in' && (
                <p><strong>Table Number:</strong> {billData.table}</p>
              )}
              <p><strong>Order Type:</strong> {billData.orderType}</p>
              <div className="mt-4 max-h-60 overflow-auto border p-2 rounded">
                {billData.orders.map((order, idx) => (
                  <div key={idx} className="mb-2 border-b pb-1">
                    <div>
                      <strong>Items:</strong>
                      <ul className="list-disc list-inside">
                        {order.items?.map((item, i) => (
                          <li key={i}>
                            {item.quantity} x {item.name} - Rs.{item.price}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>Subtotal:</strong> Rs.{order.subtotal?.toFixed(2) || '0.00'}
                    </div>
                    <div>
                      <strong>Status:</strong> {order.status}
                    </div>
                    <div>
                      <strong>Payment:</strong> {order.paymentMethod}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-right font-bold mt-4">Total: Rs.{billData.total}</p>

              <button
                onClick={handlePrint}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full no-print"
              >
                Print Bill
              </button>

              <button
                onClick={() => setBillData(null)}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded w-full no-print"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;