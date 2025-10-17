
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../../redux/slices/productSlice';
import { Product } from '../../types';

type AddProductFormInputs = Omit<Product, 'id' | 'rating' | 'imageUrl'>;

const AddProduct: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<AddProductFormInputs>();

    const onSubmit: SubmitHandler<AddProductFormInputs> = (data) => {
        const newProduct: Product = {
            ...data,
            id: `prod_${Date.now()}`,
            rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)), // Mock rating
            imageUrl: `https://picsum.photos/seed/${Date.now()}/400/300`, // Mock image
            price: Number(data.price),
            minOrderQty: Number(data.minOrderQty),
            maxOrderQty: Number(data.maxOrderQty),
            stockQty: Number(data.stockQty),
        };
        dispatch(addProduct(newProduct));
        navigate('/products');
    };
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add a New Product</h1>
            <div className="mt-8 max-w-4xl mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Title</label>
                            <input
                                {...register('title', { required: 'Title is required' })}
                                id="title"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                        </div>

                        {/* Brand */}
                        <div>
                            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Brand</label>
                            <input
                                {...register('brand', { required: 'Brand is required' })}
                                id="brand"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>}
                        </div>

                        {/* Category */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                            <select
                                {...register('category', { required: 'Category is required' })}
                                id="category"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="">Select a category</option>
                                <option>Electronics</option>
                                <option>Machinery</option>
                                <option>Tools</option>
                                <option>Safety Gear</option>
                            </select>
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                            <input
                                {...register('location', { required: 'Location is required' })}
                                id="location"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
                        </div>

                        {/* Price */}
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price ($)</label>
                            <input
                                {...register('price', { required: 'Price is required', valueAsNumber: true, min: { value: 0.01, message: "Price must be positive" } })}
                                id="price"
                                type="number"
                                step="0.01"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            {errors.stockQty && <p className="text-red-500 text-xs mt-1">{errors.stockQty.message}</p>}
                        </div>

                        {/* Min Order Quantity */}
                        <div>
                            <label htmlFor="minOrderQty" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Min Order Qty</label>
                            <input
                                {...register('minOrderQty', { required: 'MOQ is required', valueAsNumber: true, min: { value: 1, message: "MOQ must be at least 1" } })}
                                id="minOrderQty"
                                type="number"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            {errors.minOrderQty && <p className="text-red-500 text-xs mt-1">{errors.minOrderQty.message}</p>}
                        </div>

                        {/* Max Order Quantity */}
                        <div>
                            <label htmlFor="maxOrderQty" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Order Qty</label>
                            <input
                                {...register('maxOrderQty', { required: 'Max Order Qty is required', valueAsNumber: true, min: { value: 1, message: "Max Order Qty must be at least 1" } })}
                                id="maxOrderQty"
                                type="number"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            {errors.maxOrderQty && <p className="text-red-500 text-xs mt-1">{errors.maxOrderQty.message}</p>}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                            {...register('description', { required: 'Description is required' })}
                            id="description"
                            rows={4}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                    </div>

                    <div className="flex justify-end space-x-4">
                         <button type="button" onClick={() => navigate('/products')} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Add Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
