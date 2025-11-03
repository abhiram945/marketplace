import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateProduct } from '../../redux/slices/productSlice';
import { Product } from '../../types';
import { RootState } from '../../redux/store';
import AlertModal from '../../components/common/AlertModal';

type EditProductFormInputs = Omit<Product, 'id' | 'rating' | 'imageUrl' | 'features'>;

const EditProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const product = useSelector((state: RootState) => state.products.allProducts.find(p => p.id === id));
    
    const [alertState, setAlertState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'success' | 'error';
    }>({ isOpen: false, title: '', message: '', type: 'success' });

    const { register, handleSubmit, formState: { errors } } = useForm<EditProductFormInputs>({
        defaultValues: product ? {
            ...product,
            price: Number(product.price),
            minOrderQty: Number(product.minOrderQty),
            maxOrderQty: Number(product.maxOrderQty),
            stockQty: Number(product.stockQty),
        } : {}
    });

    const onSubmit: SubmitHandler<EditProductFormInputs> = (data) => {
        if (!product) return;

        const newPrice = Number(data.price);
        const newStock = Number(data.stockQty);

        if (newPrice > product.price) {
            setAlertState({
                isOpen: true,
                title: 'Invalid Price Change',
                message: 'Price can only be decreased or kept the same.',
                type: 'error',
            });
            return;
        }

        if (newStock < product.stockQty) {
            setAlertState({
                isOpen: true,
                title: 'Invalid Stock Change',
                message: 'Stock quantity can only be increased or kept the same.',
                type: 'error',
            });
            return;
        }
        
        const hasChanged = newPrice !== product.price || newStock !== product.stockQty;
        if (!hasChanged) {
            setAlertState({
                isOpen: true,
                title: 'No Changes Detected',
                message: 'You have not made any changes to the price or stock quantity.',
                type: 'error',
            });
            return;
        }


        const updatedProduct: Product = {
            ...product,
            ...data,
            price: newPrice,
            stockQty: newStock,
        };
        dispatch(updateProduct(updatedProduct));
        
        setAlertState({
            isOpen: true,
            title: 'Update Successful',
            message: 'Subscribed users will be notified of the changes.',
            type: 'success',
        });
    };
    
    const handleCloseAlert = () => {
        const isSuccess = alertState.type === 'success';
        setAlertState({ isOpen: false, title: '', message: '', type: 'success' });
        if (isSuccess) {
            navigate('/products');
        }
    };

    if (!product) {
        return <div className="text-center p-8">Product not found.</div>
    }

    const readOnlyInputClasses = "mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed";
    const editableInputClasses = "mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500";
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Only price and stock are editable. Price can only be decreased and stock can only be increased.</p>
            <div className="mt-8 max-w-4xl mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Title</label>
                            <input {...register('title')} id="title" readOnly className={readOnlyInputClasses} />
                        </div>

                        {/* Brand */}
                        <div>
                            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Brand</label>
                            <input {...register('brand')} id="brand" readOnly className={readOnlyInputClasses} />
                        </div>

                        {/* Category */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                             <input {...register('category')} id="category" readOnly className={readOnlyInputClasses} />
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                            <input {...register('location')} id="location" readOnly className={readOnlyInputClasses} />
                        </div>

                        {/* Price */}
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price ($)</label>
                            <input
                                {...register('price', { required: 'Price is required', valueAsNumber: true, min: { value: 0.01, message: "Price must be positive" } })}
                                id="price"
                                type="number"
                                step="0.01"
                                className={editableInputClasses}
                            />
                            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                        </div>

                        {/* Stock Quantity */}
                        <div>
                            <label htmlFor="stockQty" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock Quantity</label>
                            <input
                                {...register('stockQty', { required: 'Stock is required', valueAsNumber: true, min: { value: 0, message: "Stock cannot be negative" } })}
                                id="stockQty"
                                type="number"
                                className={editableInputClasses}
                            />
                            {errors.stockQty && <p className="text-red-500 text-xs mt-1">{errors.stockQty.message}</p>}
                        </div>

                        {/* Min Order Quantity */}
                        <div>
                            <label htmlFor="minOrderQty" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Min Order Qty</label>
                            <input {...register('minOrderQty')} id="minOrderQty" type="number" readOnly className={readOnlyInputClasses} />
                        </div>

                        {/* Max Order Quantity */}
                        <div>
                            <label htmlFor="maxOrderQty" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Order Qty</label>
                            <input {...register('maxOrderQty')} id="maxOrderQty" type="number" readOnly className={readOnlyInputClasses} />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea {...register('description')} id="description" rows={4} readOnly className={readOnlyInputClasses} />
                    </div>

                    <div className="flex justify-end space-x-4">
                         <button type="button" onClick={() => navigate('/products')} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
            <AlertModal
                isOpen={alertState.isOpen}
                onClose={handleCloseAlert}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />
        </div>
    );
};

export default EditProduct;