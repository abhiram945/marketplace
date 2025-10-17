import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types';
import { mockProducts } from '../../utils/mockData';

interface ProductState {
  allProducts: Product[];
  filteredProducts: Product[];
}

const initialState: ProductState = {
  allProducts: mockProducts,
  filteredProducts: mockProducts,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<Product>) {
      state.allProducts.unshift(action.payload);
      state.filteredProducts.unshift(action.payload);
    },
    updateProduct(state, action: PayloadAction<Product>) {
        const index = state.allProducts.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
            state.allProducts[index] = action.payload;
            // Also update filtered products if it exists there
            const filteredIndex = state.filteredProducts.findIndex(p => p.id === action.payload.id);
            if (filteredIndex !== -1) {
                state.filteredProducts[filteredIndex] = action.payload;
            }
        }
    }
  },
});

export const { addProduct, updateProduct } = productSlice.actions;

export default productSlice.reducer;