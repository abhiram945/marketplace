import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { toggleSubscription } from '../../redux/slices/notificationSlice';
import { ShoppingCart, Tag, Package } from '../../components/icons';
import ProductCard from '../../components/products/ProductCard';
import { useAuth } from '../../hooks/useAuth';
import AddToCartModal from '../../components/products/AddToCartModal';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role } = useAuth();
  const { allProducts } = useSelector((state: RootState) => state.products);
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const { subscriptions } = useSelector((state: RootState) => state.notifications);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const product = allProducts.find(p => p.id === id);
  const isInCart = product ? cartItems.some(item => item.id === product.id) : false;
  const isPriceSubscribed = product ? subscriptions.some(s => s.productId === product.id && s.type === 'price') : false;
  const isStockSubscribed = product ? subscriptions.some(s => s.productId === product.id && s.type === 'stock') : false;

  if (!product) {
    return <div className="text-center py-10">Product not found.</div>;
  }
  
  const relatedProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column: Description */}
            <div className="lg:col-span-2">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{product.title}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">from {product.brand}</p>
                <p className="mt-6 text-gray-700 dark:text-gray-300 text-lg whitespace-pre-wrap">{product.description}</p>
            </div>
            
            {/* Right Column: Price, Details, Actions */}
            <div className="flex flex-col">
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">${product.price}</span>
                <span className="text-lg text-gray-500 dark:text-gray-400"> / unit</span>
              </div>

              <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600 space-y-3 text-gray-700 dark:text-gray-300">
                <div className="flex justify-between"><strong>Min. Order:</strong> <span>{product.minOrderQty} units</span></div>
                <div className="flex justify-between"><strong>Max. Order:</strong> <span>{product.maxOrderQty} units</span></div>
                <div className="flex justify-between"><strong>Available Stock:</strong> <span className={product.stockQty < 100 ? 'text-red-500' : 'text-green-500'}>{product.stockQty} units</span></div>
                <div className="flex justify-between"><strong>Location:</strong> <span>{product.location}</span></div>
                <div className="flex justify-between"><strong>Condition:</strong> <span>{product.condition}</span></div>
              </div>
              
              {role === 'buyer' && (
                <div className="mt-auto space-y-3">
                    <button 
                      onClick={() => setIsCartModalOpen(true)}
                      disabled={isInCart}
                      className={`w-full flex items-center justify-center px-8 py-3 text-white text-base font-medium rounded-md transition-colors ${
                          isInCart 
                          ? 'bg-green-500 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {isInCart ? 'Added to Cart' : 'Add to Cart'}
                    </button>
                    <button
                      onClick={() => handleToggleSubscription('price')}
                      className={`w-full flex items-center justify-center px-8 py-3 border text-base font-medium rounded-md transition-colors ${
                          isPriceSubscribed
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Tag className="w-5 h-5 mr-2" />
                      {isPriceSubscribed ? 'Price Alert Active' : 'Notify on Price Drop'}
                    </button>
                    <button
                      onClick={() => handleToggleSubscription('stock')}
                      className={`w-full flex items-center justify-center px-8 py-3 border text-base font-medium rounded-md transition-colors ${
                          isStockSubscribed
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Package className="w-5 h-5 mr-2" />
                      {isStockSubscribed ? 'Stock Alert Active' : 'Notify when in Stock'}
                    </button>
                </div>
              )}
            </div>
        </div>
      </div>
      
      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Related Products</h2>
        <div className="mt-6 flex flex-col gap-6">
          {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
      
      {role === 'buyer' && product && (
        <AddToCartModal 
            isOpen={isCartModalOpen}
            onClose={() => setIsCartModalOpen(false)}
            product={product}
        />
      )}
    </div>
  );
};

export default ProductDetails;