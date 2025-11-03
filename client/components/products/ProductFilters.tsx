import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { ChevronDown } from '../icons';

interface ProductFiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, setFilters }) => {
  const { allProducts } = useSelector((state: RootState) => state.products);
  const [localPriceRange, setLocalPriceRange] = useState(filters.priceRange);
  const [areOtherFiltersVisible, setAreOtherFiltersVisible] = useState(false);

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
      brands: Array.from(brands).sort(),
      locations: Array.from(locations).sort(),
      categories: Array.from(categories).sort(),
    };
  }, [allProducts]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleBrandClick = (brand: string) => {
    setFilters({ ...filters, brand: brand });
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
    if (localPriceRange[0] > localPriceRange[1]) {
        setFilters({ ...filters, priceRange: [localPriceRange[1], localPriceRange[1]] });
    } else {
        setFilters({ ...filters, priceRange: localPriceRange });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <div className="space-y-4">
        <div>
          <h3 className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Shop by Brand</h3>
          <div className="flex flex-wrap gap-2">
              <button
                  onClick={() => handleBrandClick('')}
                  className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${filters.brand === '' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
              >
                  All Brands
              </button>
              {uniqueValues.brands.map(b => (
                   <button
                      key={b}
                      onClick={() => handleBrandClick(b)}
                      className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${filters.brand === b ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                  >
                      {b}
                  </button>
              ))}
          </div>
        </div>
        
        <div className="pt-4 border-t dark:border-gray-700">
           <button onClick={() => setAreOtherFiltersVisible(!areOtherFiltersVisible)} className="flex items-center justify-between w-full text-left">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">More Filters</h3>
              <ChevronDown className={`w-5 h-5 transition-transform ${areOtherFiltersVisible ? 'transform rotate-180' : ''}`} />
            </button>
            {areOtherFiltersVisible && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select name="category" id="category" value={filters.category} onChange={handleInputChange} className="block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">All Categories</option>
                    {uniqueValues.categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                
                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                  <select name="location" id="location" value={filters.location} onChange={handleInputChange} className="block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">All Locations</option>
                    {uniqueValues.locations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price Range</label>
                  <div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>Min: ${localPriceRange[0]}</span>
                          <span>Max: ${localPriceRange[1]}</span>
                      </div>
                      <div className="flex space-x-2">
                        <input type="range" name="minPrice" id="minPrice" min="0" max="1000" value={localPriceRange[0]} onChange={handlePriceInputChange} onMouseUp={handlePriceChangeCommit} onTouchEnd={handlePriceChangeCommit} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600" />
                        <input type="range" name="maxPrice" id="maxPrice" min="0" max="1000" value={localPriceRange[1]} onChange={handlePriceInputChange} onMouseUp={handlePriceChangeCommit} onTouchEnd={handlePriceChangeCommit} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600" />
                      </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;