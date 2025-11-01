import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../redux/store';
import { removeFromCart, updateQuantity } from '../redux/slices/cartSlice';
import { Trash2 as TrashIcon } from '../components/icons';
import { CartItem } from '../types';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const { items: cartItems } = useSelector((state: RootState) => state.cart);

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };
  
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const QuantityInput = ({ item }: { item: CartItem }) => {
    const [quantity, setQuantity] = useState(item.quantity);
    const [error, setError] = useState('');

    useEffect(() => {
        setQuantity(item.quantity)
    }, [item.quantity])

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow empty input for user typing
        if (value === '') {
            setQuantity(NaN);
            setError('');
            return;
        }

        const numValue = parseInt(value, 10);
        setQuantity(numValue);

        if (numValue < item.minOrderQty) {
            setError(`Min order is ${item.minOrderQty}`);
        } else if (numValue > item.maxOrderQty) {
            setError(`Max order is ${item.maxOrderQty}`);
        } else {
            setError('');
            dispatch(updateQuantity({ id: item.id, quantity: numValue }));
        }
    };
    
    const handleBlur = () => {
        if (isNaN(quantity) || quantity < item.minOrderQty) {
            setQuantity(item.minOrderQty);
            dispatch(updateQuantity({ id: item.id, quantity: item.minOrderQty }));
            setError('');
        }
    }

    return (
        <div className="ml-4">
            <label htmlFor={`quantity-${item.id}`} className="sr-only">Quantity</label>
            <input 
                id={`quantity-${item.id}`}
                type="number"
                value={isNaN(quantity) ? '' : quantity}
                onChange={handleQuantityChange}
                onBlur={handleBlur}
                min={item.minOrderQty}
                max={item.maxOrderQty}
                className="w-20 rounded-md border border-gray-300 py-1.5 text-center text-sm font-medium text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Cart</h1>
      
      <div className="mt-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <section className="lg:col-span-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {cartItems.length > 0 ? (
              <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                {cartItems.map(item => (
                  <li key={item.id} className="flex py-6 px-4 sm:px-6">
                    <div className="flex flex-1 flex-col">
                      <div className="flex">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm">
                            <Link to={`/products/${item.id}`} className="font-medium text-gray-700 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white">
                              {item.title}
                            </Link>
                          </h4>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.brand}</p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flow-root">
                          <button onClick={() => handleRemove(item.id)} type="button" className="-m-2.5 flex items-center justify-center bg-white dark:bg-gray-800 p-2.5 text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300">
                            <span className="sr-only">Remove</span>
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-1 items-end justify-between pt-2">
                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">${item.price.toFixed(2)}</p>
                        <QuantityInput item={item} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-16 px-4">
                <h2 className="text-xl font-medium text-gray-900 dark:text-white">Your cart is empty</h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Browse products to add items to your cart.</p>
                <div className="mt-6">
                  <Link to="/products" className="inline-block rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Order summary */}
        {cartItems.length > 0 && (
          <section className="mt-16 rounded-lg bg-white dark:bg-gray-800 shadow lg:col-span-4 lg:mt-0 p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Order summary</h2>
            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600 dark:text-gray-300">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">${subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                <dt className="text-base font-medium text-gray-900 dark:text-white">Order total</dt>
                <dd className="text-base font-medium text-gray-900 dark:text-white">${subtotal.toFixed(2)}</dd>
              </div>
            </dl>
            <div className="mt-6">
              <button
                type="submit"
                className="w-full rounded-md border border-transparent bg-blue-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Checkout
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Cart;