import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Product } from '../../types';
import { addToCart } from '../../redux/slices/cartSlice';
import { updateProduct } from '../../redux/slices/productSlice';
import { toggleSubscription } from '../../redux/slices/notificationSlice';
import { RootState } from '../../redux/store';
import { Star, ShoppingCart, Edit, CheckCircle as CheckIcon, X as XIcon, Bell } from '../icons';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../common/Modal';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const { role } = useAuth();
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const { subscriptions } = useSelector((state: RootState) => state.notifications);

  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState(product.price);
  const [isEditingStock, setIsEditingStock] = useState(false);
  const [newStockQty, setNewStockQty] = useState(product.stockQty);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  const isInCart = cartItems.some(item => item.id === product.id);
  const isPriceSubscribed = subscriptions.some(s => s.productId === product.id && s.type === 'price');
  const isStockSubscribed = subscriptions.some(s => s.productId === product.id && s.type === 'stock');
  
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

  const showModal = (title: string, message: string) => {
    setModalContent({ title, message });
    setIsModalOpen(true);
  };

  const handlePriceSave = () => {
    if (newPrice > product.price) {
      showModal("Invalid Price Change", "Price cannot be increased.");
      setNewPrice(product.price);
      setIsEditingPrice(false);
      return;
    }

    if (newPrice > 0) {
      dispatch(updateProduct({ ...product, price: newPrice }));
      showModal("Price Updated", "Buyers will be notified.");
      setIsEditingPrice(false);
    } else {
      setNewPrice(product.price);
    }
  };

  const handleStockSave = () => {
    if (newStockQty < product.stockQty) {
      showModal("Invalid Stock Change", "Stock quantity cannot be decreased.");
      setNewStockQty(product.stockQty);
      setIsEditingStock(false);
      return;
    }
    
    if (newStockQty >= 0) {
        dispatch(updateProduct({ ...product, stockQty: newStockQty }));
        showModal("Stock Updated", "Buyers will be notified.");
        setIsEditingStock(false);
    } else {
        setNewStockQty(product.stockQty);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden w-full">
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {/* Column 1 & 2: Main Info & Details */}
          <div className="md:col-span-2">
            <Link to={`/products/${product.id}`} className="block">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">{product.title}</h3>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">{product.category} by <span className="font-medium">{product.brand}</span></p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Location: {product.location}</p>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="ml-1 text-gray-600 dark:text-gray-300 text-sm">{product.rating}</span>
              </div>
            </div>
          </div>

          {/* Column 3: Stats & Price */}
          <div className="md:col-span-1">
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <p>MOQ: <span className="font-semibold text-gray-800 dark:text-gray-200">{product.minOrderQty} units</span></p>
              <p>Max Order: <span className="font-semibold text-gray-800 dark:text-gray-200">{product.maxOrderQty} units</span></p>
              <div className="flex items-center">
                <span className="mr-1">In Stock:</span>
                {role === 'vendor' && isEditingStock ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={newStockQty}
                      onChange={(e) => setNewStockQty(parseInt(e.target.value, 10) || 0)}
                      className="w-24 p-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      min={product.stockQty}
                      autoFocus
                    />
                    <button onClick={handleStockSave} className="text-green-500 hover:text-green-600"><CheckIcon className="w-5 h-5" /></button>
                    <button onClick={() => { setIsEditingStock(false); setNewStockQty(product.stockQty); }} className="text-red-500 hover:text-red-600"><XIcon className="w-5 h-5" /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${product.stockQty < 100 ? 'text-red-500' : 'text-green-500'}`}>{product.stockQty} units</span>
                    {role === 'vendor' && (
                      <button onClick={() => setIsEditingStock(true)} className="ml-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              {role === 'vendor' && isEditingPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg">$</span>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(parseFloat(e.target.value))}
                    className="w-24 p-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    step="0.01"
                    autoFocus
                  />
                  <button onClick={handlePriceSave} className="text-green-500 hover:text-green-600"><CheckIcon className="w-6 h-6" /></button>
                  <button onClick={() => { setIsEditingPrice(false); setNewPrice(product.price); }} className="text-red-500 hover:text-red-600"><XIcon className="w-6 h-6" /></button>
                </div>
              ) : (
                <>
                  <span>${product.price.toFixed(2)}</span>
                  {role === 'vendor' && (
                    <button onClick={() => setIsEditingPrice(true)} className="ml-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">
                      <Edit className="w-5 h-5" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Column 4: Actions */}
          <div className="md:col-span-1 flex flex-col space-y-2 justify-start">
              {role === 'buyer' && (
                  <>
                      <button 
                          onClick={handleAddToCart} 
                          disabled={isInCart}
                          className={`w-full flex items-center justify-center px-4 py-2 text-white text-sm font-medium rounded-md transition-colors ${
                              isInCart 
                              ? 'bg-green-600 cursor-not-allowed' 
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                      >
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          {isInCart ? 'In Cart' : 'Add to Cart'}
                      </button>
                      <button
                          onClick={() => handleToggleSubscription('price')}
                          className={`w-full flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md transition-colors ${
                              isPriceSubscribed
                              ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                      >
                          <Bell className="w-5 h-5 mr-2" />
                          {isPriceSubscribed ? 'Price Alert On' : 'Notify Price Drop'}
                      </button>
                      <button
                          onClick={() => handleToggleSubscription('stock')}
                          className={`w-full flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md transition-colors ${
                              isStockSubscribed
                              ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                      >
                          <Bell className="w-5 h-5 mr-2" />
                          {isStockSubscribed ? 'Stock Alert On' : 'Notify Stock'}
                      </button>
                  </>
              )}
          </div>
        </div>
      </div>
       <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalContent.title}
      >
        <p>{modalContent.message}</p>
      </Modal>
    </>
  );
};

export default ProductCard;