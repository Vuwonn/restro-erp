// src/pages/Reports.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { POS_API_END_POINT } from '@/utils/constant';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#FF8042', '#0088FE'];

const Reports = () => {
  const [daily, setDaily] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [topItems, setTopItems] = useState([]);

  useEffect(() => {
    axios.get(`${POS_API_END_POINT}/daily-sales`, { withCredentials: true }).then(res => setDaily(res.data));
    axios.get(`${POS_API_END_POINT}/monthly-sales`, { withCredentials: true }).then(res => setMonthly(res.data));
    axios.get(`${POS_API_END_POINT}/top-items`, { withCredentials: true }).then(res => setTopItems(res.data));
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📈 Sales Reports</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow-md p-4 rounded-xl">
          <h2 className="text-lg font-semibold">Today’s Sales</h2>
          <p className="text-2xl font-bold text-green-600">Rs. {daily?.totalSales || 0}</p>
          <p className="text-sm text-gray-500">{daily?.orders || 0} orders</p>
        </div>
        <div className="bg-white shadow-md p-4 rounded-xl">
          <h2 className="text-lg font-semibold">Monthly Sales</h2>
          <p className="text-2xl font-bold text-blue-600">Rs. {monthly?.totalSales || 0}</p>
          <p className="text-sm text-gray-500">{monthly?.orders || 0} orders</p>
        </div>
        <div className="bg-white shadow-md p-4 rounded-xl">
          <h2 className="text-lg font-semibold">Top Item</h2>
          <p className="text-2xl font-bold text-purple-600">{topItems[0]?._id || 'N/A'}</p>
          <p className="text-sm text-gray-500">{topItems[0]?.totalQuantity || 0} sold</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Daily Sales Bar Chart */}
        <div className="bg-white shadow-md p-4 rounded-xl">
          <h3 className="text-xl font-semibold mb-2">Top Items Sold</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topItems}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalQuantity" fill="#8884d8" name="Quantity Sold" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Items Pie Chart */}
        <div className="bg-white shadow-md p-4 rounded-xl">
          <h3 className="text-xl font-semibold mb-2">Top Items (Pie View)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topItems}
                dataKey="totalQuantity"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {topItems.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
