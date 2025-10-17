import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { addToCart } from '../../redux/slices/cartSlice';
import { toggleSubscription } from '../../redux/slices/notificationSlice';
import { Star, ShoppingCart, Bell } from '../../components/icons';
import ProductCard from '../../components/products/ProductCard';
import { useAuth } from '../../hooks/useAuth';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role } = useAuth();
  const { allProducts } = useSelector((state: RootState) => state.products);
  const { subscriptions } = useSelector((state: RootState) => state.notifications);
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const [notified, setNotified] = useState<string | null>(null);

  const product = allProducts.find(p => p.id === id);
  const isInCart = product ? cartItems.some(item => item.id === product.id) : false;

  if (!product) {
    return <div className="text-center py-10">Product not found.</div>;
  }
  
  const isPriceSubscribed = subscriptions.some(s => s.productId === product.id && s.type === 'price');
  const isStockSubscribed = subscriptions.some(s => s.productId === product.id && s.type === 'stock');
  
  const relatedProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (role === 'buyer' && !isInCart) {
      dispatch(addToCart(product));
    }
  };

  const handleNotificationClick = (type: 'price' | 'stock') => {
    if (role === 'vendor') {
      setNotified(type);
      setTimeout(() => setNotified(null), 2000);
    } else {
      dispatch(toggleSubscription({ productId: product.id, type, productTitle: product.title }));
    }
  };

  return (
    <div className="container mx-auto">
       <button onClick={() => navigate(-1)} className="mb-6 text-blue-600 dark:text-blue-400 hover:underline">
        &larr; Back to Products
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <img src={product.imageUrl} alt={product.title} className="w-full h-auto rounded-lg object-cover" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{product.title}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">from {product.brand}</p>
            <div className="flex items-center mt-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-6 h-6 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="ml-2 text-gray-600 dark:text-gray-300">{product.rating} / 5.0</span>
            </div>
            
            <p className="mt-6 text-gray-700 dark:text-gray-300 text-lg">{product.description}</p>
            
            <div className="mt-6">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">${product.price}</span>
              <span className="text-lg text-gray-500 dark:text-gray-400"> / unit</span>
            </div>

            <div className="mt-6 space-y-2 text-gray-700 dark:text-gray-300">
              <p><strong>Min. Order:</strong> {product.minOrderQty} units</p>
              <p><strong>Max. Order:</strong> {product.maxOrderQty} units</p>
              <p><strong>Available Stock:</strong> {product.stockQty} units</p>
              <p><strong>Location:</strong> {product.location}</p>
            </div>
            
            <div className="mt-8 flex flex-col space-y-3">
              {role === 'buyer' && (
                <button 
                  onClick={handleAddToCart}
                  disabled={isInCart}
                  className={`w-full flex items-center justify-center px-8 py-3 text-white text-base font-medium rounded-md transition-colors ${
                      isInCart 
                      ? 'bg-green-500 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isInCart ? 'Added in Cart' : 'Add to Cart'}
                </button>
              )}
               <div className="flex space-x-2 text-sm">
                <button onClick={() => handleNotificationClick('price')} className={`w-1/2 flex items-center justify-center p-3 rounded-md transition-colors ${role === 'buyer' && isPriceSubscribed ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}>
                    <Bell className="w-4 h-4 mr-1"/> {notified === 'price' ? 'Notified ✓' : (role === 'vendor' ? 'Notify Buyers (Price)' : 'Notify on Price Drop')}
                </button>
                <button onClick={() => handleNotificationClick('stock')} className={`w-1/2 flex items-center justify-center p-3 rounded-md transition-colors ${role === 'buyer' && isStockSubscribed ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}>
                   <Bell className="w-4 h-4 mr-1"/> {notified === 'stock' ? 'Notified ✓' : (role === 'vendor' ? 'Notify Buyers (Stock)' : 'Notify on Stock Recharge')}
                </button>
            </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Related Products</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;