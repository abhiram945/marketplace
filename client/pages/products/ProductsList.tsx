import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import ProductCard from '../../components/products/ProductCard';
import ProductFilters from '../../components/products/ProductFilters';
import { Product } from '../../types';
import { ChevronDown } from '../../components/icons';
import { useAuth } from '../../hooks/useAuth';

const ProductsList: React.FC = () => {
  const { role } = useAuth();
  const { allProducts } = useSelector((state: RootState) => state.products);
  const [filters, setFilters] = useState({
    brand: '',
    location: '',
    category: '',
    priceRange: [0, 1000],
    rating: 0,
  });
  const [sort, setSort] = useState('price_asc');

  const filteredAndSortedProducts = useMemo(() => {
    let products: Product[] = [...allProducts];

    if (role === 'buyer') {
      // Filtering for buyers
      products = products.filter(p => 
        (filters.brand === '' || p.brand === filters.brand) &&
        (filters.location === '' || p.location === filters.location) &&
        (filters.category === '' || p.category === filters.category) &&
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1] &&
        p.rating >= filters.rating
      );
    }

    // Sorting for everyone
    products.sort((a, b) => {
      switch (sort) {
        case 'price_asc': return a.price - b.price;
        case 'price_desc': return b.price - a.price;
        case 'rating_desc': return b.rating - a.rating;
        default: return 0;
      }
    });

    return products;
  }, [allProducts, filters, sort, role]);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="flex">
        {/* Filters Sidebar - Only for Buyers */}
        {role === 'buyer' && (
          <>
            <div className={`fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity lg:hidden ${isFilterOpen ? 'block' : 'hidden'}`} onClick={() => setIsFilterOpen(false)}></div>
            <aside className={`fixed top-0 left-0 z-40 w-80 h-full bg-white dark:bg-gray-800 p-6 transform transition-transform lg:static lg:z-auto lg:translate-x-0 lg:block lg:w-1/4 xl:w-1/5 ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <ProductFilters filters={filters} setFilters={setFilters} />
            </aside>
          </>
        )}

        <div className={`flex-1 ${role === 'buyer' ? 'lg:ml-6' : ''}`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 flex items-center justify-between">
                 {role === 'buyer' && (
                    <button className="lg:hidden p-2 rounded-md bg-gray-200 dark:bg-gray-700" onClick={() => setIsFilterOpen(true)}>
                        <ChevronDown className="w-6 h-6"/>
                        <span className="sr-only">Open Filters</span>
                    </button>
                 )}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing <span className="font-bold">{filteredAndSortedProducts.length}</span> of <span className="font-bold">{allProducts.length}</span> products
                </p>
                <div className="flex items-center">
                    <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
                    <select
                        id="sort"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    >
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="rating_desc">Highest Rated</option>
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
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your filters.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default ProductsList;