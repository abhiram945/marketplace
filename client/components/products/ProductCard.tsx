import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Product } from '../../types';
import { addToCart } from '../../redux/slices/cartSlice';
import { toggleSubscription } from '../../redux/slices/notificationSlice';
import { RootState } from '../../redux/store';
import { ShoppingCart, Edit, Tag, Package } from '../icons';
import { useAuth } from '../../hooks/useAuth';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const { role } = useAuth();
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const { subscriptions } = useSelector((state: RootState) => state.notifications);
  
  const [quantity, setQuantity] = useState(product.minOrderQty);
  const [error, setError] = useState('');

  const isInCart = cartItems.some(item => item.id === product.id);
  const isPriceSubscribed = subscriptions.some(s => s.productId === product.id && s.type === 'price');
  const isStockSubscribed = subscriptions.some(s => s.productId === product.id && s.type === 'stock');

  useEffect(() => {
    if (isInCart) {
      const cartItem = cartItems.find(item => item.id === product.id);
      if(cartItem) setQuantity(cartItem.quantity);
    } else {
      setQuantity(product.minOrderQty);
    }
  }, [isInCart, cartItems, product]);
  
  const handleToggleSubscription = (type: 'price' | 'stock') => {
    dispatch(toggleSubscription({
      productId: product.id,
      type,
      productTitle: product.title,
    }));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueStr = e.target.value;
    if (valueStr === '') {
        setQuantity(NaN);
        setError('');
        return;
    }
    const value = parseInt(valueStr, 10);
    setQuantity(value);
    
    if (isNaN(value)) {
        setError('Invalid number');
    } else if (value < product.minOrderQty) {
      setError(`Min is ${product.minOrderQty}`);
    } else if (value > product.maxOrderQty) {
      setError(`Max is ${product.maxOrderQty}`);
    } else {
      setError('');
    }
  };

  const handleAddToCart = () => {
    if (!error && !isNaN(quantity)) {
      dispatch(addToCart({ product, quantity }));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden w-full p-4">
      <div className="grid grid-cols-12 gap-4 items-center">
          
          <div className="col-span-12 md:col-span-3">
              <Link to={`/products/${product.id}`} className="block">
                  <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">{product.title}</h3>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400">{product.category} by <span className="font-medium">{product.brand}</span></p>
          </div>

          <div className="col-span-6 md:col-span-1">
              <p className="text-sm text-gray-700 dark:text-gray-300">{product.condition}</p>
          </div>
          
          <div className="col-span-6 md:col-span-1 text-left">
               <p className="text-lg font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</p>
          </div>
          
          <div className="col-span-6 md:col-span-1">
              <p className="text-sm text-gray-700 dark:text-gray-300">{product.location} (EXW)</p>
          </div>
          
          <div className="col-span-6 md:col-span-1">
              <p className={`text-sm font-semibold ${product.stockQty < 100 ? 'text-red-500' : 'text-green-500'}`}>{product.stockQty} units</p>
          </div>

          <div className="col-span-12 md:col-span-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Min: {product.minOrderQty}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Max: {product.maxOrderQty}</p>
          </div>
          
          <div className="col-span-12 md:col-span-3 flex items-center justify-end gap-2">
              {role === 'buyer' && (
                <>
                  <div className="relative">
                      <input
                          type="number"
                          value={isNaN(quantity) ? '' : quantity}
                          onChange={handleQuantityChange}
                          min={product.minOrderQty}
                          max={product.maxOrderQty}
                          className="w-20 rounded-md border border-gray-300 py-1.5 text-center text-sm font-medium text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          aria-label="Quantity"
                          disabled={isInCart}
                      />
                      {error && <p className="absolute -bottom-4 left-0 text-red-500 text-xs">{error}</p>}
                  </div>
                  <button 
                      onClick={handleAddToCart} 
                      disabled={isInCart || !!error || isNaN(quantity)}
                      className="flex items-center justify-center px-3 py-2 text-white text-sm font-medium rounded-md transition-colors w-28 disabled:cursor-not-allowed ${ isInCart ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400'}"
                  >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {isInCart ? 'In Cart' : 'Add'}
                  </button>
                  <button
                      onClick={() => handleToggleSubscription('price')}
                      title={isPriceSubscribed ? 'Turn off price alerts' : 'Notify on price drop'}
                      className={`p-2 rounded-full transition-colors ${ isPriceSubscribed ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                      <Tag className="w-5 h-5" />
                  </button>
                  <button
                      onClick={() => handleToggleSubscription('stock')}
                      title={isStockSubscribed ? 'Turn off stock alerts' : 'Notify when in stock'}
                      className={`p-2 rounded-full transition-colors ${ isStockSubscribed ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                      <Package className="w-5 h-5" />
                  </button>
                </>
              )}
              {role === 'vendor' && (
                  <Link to={`/edit-product/${product.id}`} className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700">
                      <Edit className="w-5 h-5 mr-2" />
                      Edit
                  </Link>
              )}
          </div>
      </div>
    </div>
  );
};

export default ProductCard;