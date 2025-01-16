import React, { useState, useEffect } from 'react';
import { Search, ArrowUpDown, Eye } from 'lucide-react';
import { Helmet } from "react-helmet";
import { ORDER_STATUSES } from './constant';

// Badge component for displaying order statuses
const OrderStatusBadge = ({ status }) => {
  const statusColors = {
    [ORDER_STATUSES.PENDING]: 'bg-yellow-100 text-yellow-800',
    [ORDER_STATUSES.PROCESSING]: 'bg-blue-100 text-blue-800',
    [ORDER_STATUSES.SHIPPED]: 'bg-green-100 text-green-800',
    [ORDER_STATUSES.DELIVERED]: 'bg-purple-100 text-purple-800',
    [ORDER_STATUSES.CANCELLED]: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

// Modal for displaying detailed order information
const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white-600">Order Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">✕</button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-gray-600">Order ID</p><p className="font-semibold">{order.orderId}</p></div>
            <div><p className="text-sm text-gray-600">Tracking ID</p><p className="font-semibold">{order.trackingId}</p></div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Customer</p>
            <p className="font-semibold">{order.name}</p>
            <p className="text-sm text-gray-500">{order.email}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-gray-600">Date</p><p>{order.date}</p></div>
            <div><p className="text-sm text-gray-600">Time</p><p>{order.time}</p></div>
          </div>
          <div><p className="text-sm text-gray-600">Shipping Address</p><p>{order.address}</p></div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Total Price</p>
            <p className="text-xl font-bold text-white-600">${order.price}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Orders component
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/get-orders`);
      const data = await response.json();
      const ordersWithStatus = data.orders.map(order => ({
        ...order,
        status: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'][Math.floor(Math.random() * 5)]
      }));

      setOrders(ordersWithStatus);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = React.useMemo(() => {
    if (!Array.isArray(orders)) return [];

    let sortableOrders = [...orders];
    if (sortConfig.key !== null) {
      sortableOrders.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (!isNaN(aValue) && !isNaN(bValue)) {
          return sortConfig.direction === 'ascending'
            ? Number(aValue) - Number(bValue)
            : Number(bValue) - Number(aValue);
        }

        const aString = String(aValue).toLowerCase();
        const bString = String(bValue).toLowerCase();

        if (aString < bString) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aString > bString) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableOrders;
  }, [orders, sortConfig]);

  const filteredOrders = React.useMemo(() => {
    return sortedOrders.filter(order => {
      const searchLower = searchQuery.toLowerCase();
      const orderId = order.orderId?.toString().toLowerCase() || '';
      const customerName = order.name?.toLowerCase() || '';

      return orderId.includes(searchLower) || customerName.includes(searchLower);
    });
  }, [sortedOrders, searchQuery]);

  // Example orders for table
  const exampleOrders = [
    { orderId: 'ORD12345', date: '2025-01-12', time: '14:30', name: 'John Doe', email: 'john@example.com', price: '150', status: 'Pending' },
    { orderId: 'ORD12346', date: '2025-01-14', time: '16:45', name: 'Jane Smith', email: 'jane@example.com', price: '120', status: 'Processing' },
    { orderId: 'ORD12347', date: '2025-01-15', time: '09:00', name: 'Alice Green', email: 'alice@example.com', price: '180', status: 'Shipped' },
    { orderId: 'ORD12348', date: '2025-01-16', time: '11:15', name: 'Bob Brown', email: 'bob@example.com', price: '200', status: 'Delivered' },
  ];

  return (
    <div className="flex">
      <Helmet>
        <title>Orders | Admin | Food Delivery</title>
      </Helmet>
      <div className="flex-1 p-8 ml-[5rem] lg:ml-64 bg-white min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white-700 mb-4">Order Management</h1>
          <div className="w-full max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by order ID or customer name..."
                className="w-full pl-10 pr-4 py-3 border-2 border-white-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-white-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3.5 text-white-400" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-x-auto mb-8">
          <table className="min-w-full table-auto">
            <thead className="bg-white-100">
              <tr>
                {['orderId', 'date', 'time', 'name', 'email', 'price', 'status'].map((key) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-white-200 transition"
                  >
                    <div className="flex items-center">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                      <ArrowUpDown size={14} className="ml-1 text-white-500" />
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exampleOrders.map((order) => (
                <tr key={order.orderId} className="hover:bg-white-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs.{order.price}</td>
                  <td className="px-6 py-4"><OrderStatusBadge status={order.status} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-white-600 hover:text-white-800 transition flex items-center"
                    >
                      <Eye size={16} className="mr-1" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default Orders;
