
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { logout } from '../../redux/slices/userSlice';
import { Menu as MenuIcon, Bell as BellIcon, ShoppingCart as ShoppingCartIcon, LogOut as LogOutIcon, User as UserIcon } from '../icons';
import { RootState } from '../../redux/store';


interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items: cartItems } = useSelector((state: RootState) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="text-gray-500 dark:text-gray-300 focus:outline-none lg:hidden">
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        <Link to="/notifications" className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white">
            <BellIcon className="h-6 w-6" />
        </Link>

        {user?.role === 'buyer' && (
            <Link to="/cart" className="relative text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white">
                <ShoppingCartIcon className="h-6 w-6" />
                {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs rounded-full">
                        {cartItems.length}
                    </span>
                )}
            </Link>
        )}

        <div className="relative">
          <div className="flex items-center space-x-2">
            <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-200 text-sm hidden sm:block">{user?.fullName}</span>
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400">
            <LogOutIcon className="h-6 w-6" />
            <span className="hidden sm:block ml-2 text-sm">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;