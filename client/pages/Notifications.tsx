
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { removeSubscription } from '../redux/slices/notificationSlice';
import { Trash2 as TrashIcon } from '../components/icons';

const Notifications: React.FC = () => {
  const dispatch = useDispatch();
  const { subscriptions } = useSelector((state: RootState) => state.notifications);

  const handleRemove = (id: string) => {
    dispatch(removeSubscription(id));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Notifications</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your subscriptions for price drops and stock recharges.</p>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="overflow-x-auto">
          {subscriptions.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Alert Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {subscriptions.map(sub => (
                  <tr key={sub.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{sub.productTitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">{sub.type} Alert</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleRemove(sub.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">You have no active notifications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
