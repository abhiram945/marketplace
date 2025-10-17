import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Star } from '../icons';

interface ProductFiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, setFilters }) => {
  const { allProducts } = useSelector((state: RootState) => state.products);
  const [localPriceRange, setLocalPriceRange] = useState(filters.priceRange);

  useEffect(() => {
    setLocalPriceRange(filters.priceRange);
  }, [filters.priceRange]);
  
  const uniqueValues = useMemo(() => {
    const brands = new Set<string>();
    const locations = new Set<string>();
    const categories = new Set<string>();
    allProducts.forEach(p => {
      brands.add(p.brand);
      locations.add(p.location);
      categories.add(p.category);
    });
    return { 
      brands: Array.from(brands),
      locations: Array.from(locations),
      categories: Array.from(categories),
    };
  }, [allProducts]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  
  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newPriceRange = [...localPriceRange];
    if (name === 'minPrice') {
        newPriceRange[0] = parseInt(value, 10);
    } else {
        newPriceRange[1] = parseInt(value, 10);
    }
    setLocalPriceRange(newPriceRange);
  };
  
  const handlePriceChangeCommit = () => {
    // Ensure min is not greater than max
    if (localPriceRange[0] > localPriceRange[1]) {
        setFilters({ ...filters, priceRange: [localPriceRange[1], localPriceRange[1]] });
    } else {
        setFilters({ ...filters, priceRange: localPriceRange });
    }
  };
  
  const handleRatingChange = (rating: number) => {
    setFilters({ ...filters, rating });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Filters</h2>
      
      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
        <select name="category" id="category" value={filters.category} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <option value="">All Categories</option>
          {uniqueValues.categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Brand */}
      <div>
        <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Brand</label>
        <select name="brand" id="brand" value={filters.brand} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <option value="">All Brands</option>
          {uniqueValues.brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      
      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
        <select name="location" id="location" value={filters.location} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <option value="">All Locations</option>
          {uniqueValues.locations.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price Range</label>
        <div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Min: ${localPriceRange[0]}</span>
                <span>Max: ${localPriceRange[1]}</span>
            </div>
            <input type="range" name="minPrice" id="minPrice" min="0" max="1000" value={localPriceRange[0]} onChange={handlePriceInputChange} onMouseUp={handlePriceChangeCommit} onTouchEnd={handlePriceChangeCommit} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600" />
            <input type="range" name="maxPrice" id="maxPrice" min="0" max="1000" value={localPriceRange[1]} onChange={handlePriceInputChange} onMouseUp={handlePriceChangeCommit} onTouchEnd={handlePriceChangeCommit} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600" />
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Minimum Rating</label>
        <div className="flex items-center mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => handleRatingChange(star)}>
              <Star className={`w-6 h-6 ${filters.rating >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;