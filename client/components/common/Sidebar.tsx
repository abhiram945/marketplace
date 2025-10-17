import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
    Home as HomeIcon, 
    Package as PackageIcon, 
    Truck as TruckIcon, 
    Bell as BellIcon,
    X as XIcon,
    Building as BuildingIcon,
    ShoppingCart as ShoppingCartIcon
} from '../icons';


interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { role } = useAuth();
  const location = useLocation();

  const buyerLinks = [
    { to: '/dashboard', icon: HomeIcon, text: 'Dashboard' },
    { to: '/products', icon: PackageIcon, text: 'Products' },
    { to: '/orders', icon: TruckIcon, text: 'My Orders' },
    { to: '/cart', icon: ShoppingCartIcon, text: 'My Cart'},
    { to: '/notifications', icon: BellIcon, text: 'Notifications' },
  ];

  const vendorLinks = [
    { to: '/dashboard', icon: HomeIcon, text: 'Dashboard' },
    { to: '/products', icon: PackageIcon, text: 'My Products' },
    { to: '/notifications', icon: BellIcon, text: 'Notifications' },
  ];

  const links = role === 'buyer' ? buyerLinks : vendorLinks;

  const NavLink: React.FC<{ to: string; icon: React.FC<{className?: string}>; text: string }> = ({ to, icon: Icon, text }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center px-4 py-2 mt-5 rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200'
        }`}
      >
        <Icon className="w-6 h-6" />
        <span className="mx-4 font-medium">{text}</span>
      </Link>
    );
  };
  
  return (
    <>
      <div className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
           onClick={() => setIsOpen(false)}>
      </div>
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 px-4 py-4 overflow-y-auto bg-white dark:bg-gray-800 border-r dark:border-gray-700 transform transition-transform duration-300 lg:static lg:inset-0 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between">
           <Link to="/dashboard" className="flex items-center text-2xl font-bold text-gray-800 dark:text-white">
            <BuildingIcon className="w-8 h-8 text-blue-500"/>
            <span className="ml-2">Marketplace</span>
          </Link>
          <button className="lg:hidden" onClick={() => setIsOpen(false)}>
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-10">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} icon={link.icon} text={link.text} />
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;