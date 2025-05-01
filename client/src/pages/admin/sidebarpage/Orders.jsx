import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ORDER_API_END_POINT } from '@/utils/constant';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderTypeFilter, setOrderTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('day'); // default to 'today'
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
      await axios.put(`${ORDER_API_END_POINT}/orders/${orderId}`, { status: newStatus }); // Adjust API endpoint
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
        order.orderType.toLowerCase().includes(searchTerm.toLowerCase()))
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
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Orders</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by customer or type..."
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
                  <th className="py-3 px-4 border">Order Type</th>
                  <th className="py-3 px-4 border">Status</th>
                  <th className="py-3 px-4 border">Payment</th>
                  <th className="py-3 px-4 border">Subtotal</th>
                  <th className="py-3 px-4 border">Date</th>
                  <th className="py-3 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={order._id} className="text-center text-sm hover:bg-gray-50">
                    <td className="py-3 px-4 border">{index + 1}</td>
                    <td className="py-3 px-4 border">{order.customerName}</td>
                    <td className="py-3 px-4 border capitalize">{order.orderType}</td>
                    <td className="py-3 px-4 border capitalize">{order.status}</td>
                    <td className="py-3 px-4 border capitalize">{order.paymentMethod}</td>
                    <td className="py-3 px-4 border font-medium text-green-600">${order.subtotal.toFixed(2)}</td>
                    <td className="py-3 px-4 border">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 border">
                      <select
                        className="p-2 border rounded-md text-sm"
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
