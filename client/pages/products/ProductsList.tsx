import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { RootState } from '../../redux/store';
import ProductCard from '../../components/products/ProductCard';
import ProductFilters from '../../components/products/ProductFilters';
import { Product } from '../../types';
import { Search as SearchIcon } from '../../components/icons';
import { useAuth } from '../../hooks/useAuth';

const ProductsList: React.FC = () => {
  const { role } = useAuth();
  const { allProducts } = useSelector((state: RootState) => state.products);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    brand: searchParams.get('brand') || '',
    location: '',
    category: '',
    priceRange: [0, 1000],
  });
  const [sort, setSort] = useState('price_asc');

  useEffect(() => {
    setFilters(f => ({ ...f, brand: searchParams.get('brand') || '' }));
  }, [searchParams]);

  const filteredAndSortedProducts = useMemo(() => {
    let products: Product[] = [...allProducts];

    // Search filter
    if (searchQuery) {
        products = products.filter(p => 
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    if (role === 'buyer') {
      // Filtering for buyers
      products = products.filter(p => 
        (filters.brand === '' || p.brand === filters.brand) &&
        (filters.location === '' || p.location === filters.location) &&
        (filters.category === '' || p.category === filters.category) &&
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
      );
    }

    // Sorting for everyone
    products.sort((a, b) => {
      switch (sort) {
        case 'price_asc': return a.price - b.price;
        case 'price_desc': return b.price - a.price;
        default: return 0;
      }
    });

    return products;
  }, [allProducts, filters, sort, role, searchQuery]);
  
  return (
    <div className="w-full">
        {role === 'buyer' && (
          <ProductFilters filters={filters} setFilters={setFilters} />
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-auto flex-grow">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon className="w-5 h-5 text-gray-400" />
                </span>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex items-center w-full sm:w-auto">
                <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
                <select
                    id="sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                >
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                </select>
            </div>
        </div>

        {filteredAndSortedProducts.length > 0 ? (
            <div className="flex flex-col gap-6">
                {filteredAndSortedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">No products found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your filters or search.</p>
            </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
                Showing <span className="font-bold">{filteredAndSortedProducts.length}</span> of <span className="font-bold">{allProducts.length}</span> products
            </p>
        </div>
    </div>
  );
};

export default ProductsList;