import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { RootState } from '../../redux/store';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { Truck, Bell, Package, Star } from '../../components/icons';
import { mockOrders, mockProducts } from '../../utils/mockData';

const BuyerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { subscriptions } = useSelector((state: RootState) => state.notifications);

  const pendingOrders = mockOrders.filter(o => o.status === 'Pending').length;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user?.fullName}!</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">Here's a summary of your activities.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
            title="Pending Orders" 
            value={pendingOrders} 
            icon={<Truck className="h-6 w-6 text-white" />}
            colorClass="bg-yellow-500"
        />
        <DashboardCard 
            title="Total Orders" 
            value={mockOrders.length} 
            icon={<Package className="h-6 w-6 text-white" />}
            colorClass="bg-blue-500"
        />
        <DashboardCard 
            title="Notifications" 
            value={subscriptions.length} 
            icon={<Bell className="h-6 w-6 text-white" />}
            colorClass="bg-green-500"
        />
        <DashboardCard 
            title="Favorited Items" 
            value={7} 
            icon={<Star className="h-6 w-6 text-white" />}
            colorClass="bg-red-500"
        />
      </div>

      <div className="mt-10 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recently Viewed Products</h2>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {mockProducts.slice(0, 4).map(product => (
                    <Link to={`/products/${product.id}`} key={product.id} className="border dark:border-gray-700 rounded-lg p-4 transition-shadow hover:shadow-md">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{product.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">${product.price}</p>
                    </Link>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;