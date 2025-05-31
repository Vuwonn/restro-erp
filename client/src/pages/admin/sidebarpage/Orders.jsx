import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ORDER_API_END_POINT } from '@/utils/constant';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderTypeFilter, setOrderTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('day');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${ORDER_API_END_POINT}/orders/filter`);
      const sortedOrders = Array.isArray(data.orders) ? [...data.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
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
      return (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    } else if (dateFilter === 'year') {
      return orderDate.getFullYear() === now.getFullYear();
    }
    return true; 
  };

  const filteredOrders = (orders || [])
    .filter(order =>
      (order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.tableNumber && order.tableNumber.toString().includes(searchTerm)))
    )
    .filter(order =>
      (orderTypeFilter === 'all' || order.orderType === orderTypeFilter)
    )
    .filter(order =>
      (statusFilter === 'all' || order.status === statusFilter)
    )
    .filter(order =>
      filterByDate(order.createdAt)
    );

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Order Management</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by customer, type, or table..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={orderTypeFilter}
            onChange={(e) => setOrderTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="dine-in">Dine-In</option>
            <option value="delivery">Delivery</option>
            <option value="takeaway">Takeaway</option>
          </select>

          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="text-center py-20">
            <div className="text-gray-500 text-lg">Loading orders...</div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-500 text-lg">No orders found.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm">
                  <th className="py-3 px-4 border">#</th>
                  <th className="py-3 px-4 border">Customer</th>
                  <th className="py-3 px-4 border">Type</th>
                  <th className="py-3 px-4 border">Table</th>
                  <th className="py-3 px-4 border">Items</th>
                  <th className="py-3 px-4 border">Status</th>
                  <th className="py-3 px-4 border">Payment</th>
                  <th className="py-3 px-4 border">Amount</th>
                  <th className="py-3 px-4 border">Time</th>
                  <th className="py-3 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={order._id} className="text-center text-sm hover:bg-gray-50">
                    <td className="py-3 px-4 border">{index + 1}</td>
                    <td className="py-3 px-4 border">
                      {order.customerName || 'Guest'}
                      {order.specialInstructions && (
                        <div className="text-xs text-gray-500 mt-1">
                          Note: {order.specialInstructions}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 border capitalize">
                      {order.orderType}
                    </td>
                    <td className="py-3 px-4 border font-medium">
                      {order.orderType === 'dine-in' ? (
                        <span className="bg-blue-100 text-blue-800 py-1 px-2 rounded-full text-xs">
                          Table {order.tableNumber}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 border text-left">
                      <div className="max-h-20 overflow-y-auto">
                        {order.items?.map((item, i) => (
                          <div key={i} className="mb-1">
                            {item.quantity}x {item.name} (Rs.{item.price})
                            {item.specialInstructions && (
                              <div className="text-xs text-gray-500">
                                {item.specialInstructions}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 border capitalize">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 border capitalize">
                      {order.paymentMethod}
                    </td>
                    <td className="py-3 px-4 border font-medium text-green-600">
                      Rs.{order.subtotal?.toFixed(2) || '0.00'}
                    </td>
                    <td className="py-3 px-4 border text-xs">
                      {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="py-3 px-4 border">
                      <select
                        className="p-2 border rounded-md text-sm w-full"
                        value={order.status}
                        onChange={(e) => handleChangeStatus(order._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;