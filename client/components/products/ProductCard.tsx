import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Product } from '../../types';
import { addToCart } from '../../redux/slices/cartSlice';
import { toggleSubscription } from '../../redux/slices/notificationSlice';
import { RootState } from '../../redux/store';
import { Star, ShoppingCart, Bell, Edit } from '../icons';
import { useAuth } from '../../hooks/useAuth';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const { role } = useAuth();
  const { subscriptions } = useSelector((state: RootState) => state.notifications);
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const [notified, setNotified] = useState<string | null>(null);

  const isInCart = cartItems.some(item => item.id === product.id);
  const isPriceSubscribed = subscriptions.some(s => s.productId === product.id && s.type === 'price');
  const isStockSubscribed = subscriptions.some(s => s.productId === product.id && s.type === 'stock');
  
  const handleAddToCart = () => {
    if (role === 'buyer' && !isInCart) {
        dispatch(addToCart(product));
    }
  };
  
  const handleNotificationClick = (type: 'price' | 'stock') => {
    if (role === 'vendor') {
      setNotified(type);
      setTimeout(() => setNotified(null), 2000); // Reset after 2 seconds
    } else {
      dispatch(toggleSubscription({ productId: product.id, type, productTitle: product.title }));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col">
      <Link to={`/products/${product.id}`}>
        <img className="w-full h-48 object-cover" src={product.imageUrl} alt={product.title} />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
        <Link to={`/products/${product.id}`}>
            <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white truncate hover:text-blue-600 dark:hover:text-blue-400">{product.title}</h3>
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-300">{product.location}</p>
        
        <div className="flex items-center justify-between mt-2">
            <p className="text-xl font-bold text-gray-900 dark:text-white">${product.price}</p>
            <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="ml-1 text-gray-600 dark:text-gray-300">{product.rating}</span>
            </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
            <p>MOQ: <span className="font-semibold">{product.minOrderQty}</span></p>
            <p>Max Order: <span className="font-semibold">{product.maxOrderQty}</span></p>
            <p>Stock: <span className="font-semibold">{product.stockQty}</span></p>
        </div>
        
        <div className="mt-auto pt-4 flex flex-col space-y-2">
            {role === 'buyer' && (
                <button 
                    onClick={handleAddToCart} 
                    disabled={isInCart}
                    className={`w-full flex items-center justify-center px-4 py-2 text-white text-sm font-medium rounded-md transition-colors ${
                        isInCart 
                        ? 'bg-green-500 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isInCart ? 'Added in Cart' : 'Add to Cart'}
                </button>
            )}
             {role === 'vendor' && (
                <Link 
                    to={`/edit-product/${product.id}`}
                    className="w-full flex items-center justify-center px-4 py-2 text-white text-sm font-medium rounded-md bg-gray-600 hover:bg-gray-700"
                >
                    <Edit className="w-5 h-5 mr-2" />
                    Edit Product
                </Link>
            )}
            <div className="flex space-x-2 text-sm">
                <button onClick={() => handleNotificationClick('price')} className={`w-1/2 flex items-center justify-center p-2 rounded-md transition-colors ${role === 'buyer' && isPriceSubscribed ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}>
                    <Bell className="w-4 h-4 mr-1"/> {notified === 'price' ? 'Notified ✓' : (role === 'vendor' ? 'Notify Price' : 'Price Drop')}
                </button>
                <button onClick={() => handleNotificationClick('stock')} className={`w-1/2 flex items-center justify-center p-2 rounded-md transition-colors ${role === 'buyer' && isStockSubscribed ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}>
                   <Bell className="w-4 h-4 mr-1"/> {notified === 'stock' ? 'Notified ✓' : (role === 'vendor' ? 'Notify Stock' : 'Stock Recharge')}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;