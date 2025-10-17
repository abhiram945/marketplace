
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { Package, Tag, ShoppingCart, AlertCircle, PlusCircle } from '../../components/icons';
import { mockProducts, mockOrders } from '../../utils/mockData';

const VendorDashboard: React.FC = () => {
  const { user } = useAuth();
  const lowStockItems = mockProducts.filter(p => p.stockQty < 100).length;

  return (
    <div>
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user?.companyName}!</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Here's an overview of your store.</p>
            </div>
            <Link to="/add-product" className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
                <PlusCircle className="w-5 h-5 mr-2" />
                Add New Product
            </Link>
        </div>
      
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
            title="Active Listings" 
            value={mockProducts.length} 
            icon={<Package className="h-6 w-6 text-white" />}
            colorClass="bg-green-500"
        />
        <DashboardCard 
            title="Total Sales" 
            value="$1.2M" 
            icon={<Tag className="h-6 w-6 text-white" />}
            colorClass="bg-blue-500"
        />
        <DashboardCard 
            title="New Orders" 
            value={mockOrders.filter(o => o.status === 'Pending').length} 
            icon={<ShoppingCart className="h-6 w-6 text-white" />}
            colorClass="bg-yellow-500"
        />
        <DashboardCard 
            title="Low Stock Items" 
            value={lowStockItems} 
            icon={<AlertCircle className="h-6 w-6 text-white" />}
            colorClass="bg-red-500"
        />
      </div>

       <div className="mt-10 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Order Requests</h2>
            <div className="overflow-x-auto mt-4">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {mockOrders.slice(0, 5).map(order => (
                             <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{order.productTitle}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{order.orderDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                    }`}>{order.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;