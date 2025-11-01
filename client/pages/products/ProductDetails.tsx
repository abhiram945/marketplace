import React from 'react';
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
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const { subscriptions } = useSelector((state: RootState) => state.notifications);

  const product = allProducts.find(p => p.id === id);
  const isInCart = product ? cartItems.some(item => item.id === product.id) : false;
  const isPriceSubscribed = product ? subscriptions.some(s => s.productId === product.id && s.type === 'price') : false;
  const isStockSubscribed = product ? subscriptions.some(s => s.productId === product.id && s.type === 'stock') : false;

  if (!product) {
    return <div className="text-center py-10">Product not found.</div>;
  }
  
  const relatedProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (role === 'buyer' && !isInCart) {
      dispatch(addToCart(product));
    }
  };

  const handleToggleSubscription = (type: 'price' | 'stock') => {
    dispatch(toggleSubscription({
        productId: product.id,
        type,
        productTitle: product.title,
    }));
  };

  return (
    <div className="container mx-auto">
       <button onClick={() => navigate(-1)} className="mb-6 text-blue-600 dark:text-blue-400 hover:underline">
        &larr; Back to Products
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
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
                <>
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
                  <button
                    onClick={() => handleToggleSubscription('price')}
                    className={`w-full flex items-center justify-center px-8 py-3 border text-base font-medium rounded-md transition-colors ${
                        isPriceSubscribed
                        ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Bell className="w-5 h-5 mr-2" />
                    {isPriceSubscribed ? 'Price Alert Active' : 'Notify on Price Drop'}
                  </button>
                  <button
                    onClick={() => handleToggleSubscription('stock')}
                    className={`w-full flex items-center justify-center px-8 py-3 border text-base font-medium rounded-md transition-colors ${
                        isStockSubscribed
                        ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Bell className="w-5 h-5 mr-2" />
                    {isStockSubscribed ? 'Stock Alert Active' : 'Notify when in Stock'}
                  </button>
                </>
              )}
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
