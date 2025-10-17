
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationSubscription } from '../../types';
import { mockNotifications } from '../../utils/mockData';

interface NotificationState {
  subscriptions: NotificationSubscription[];
}

const initialState: NotificationState = {
  subscriptions: mockNotifications,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addSubscription(state, action: PayloadAction<NotificationSubscription>) {
      state.subscriptions.push(action.payload);
    },
    removeSubscription(state, action: PayloadAction<string>) {
      state.subscriptions = state.subscriptions.filter(sub => sub.id !== action.payload);
    },
    toggleSubscription(state, action: PayloadAction<{ productId: string; type: 'price' | 'stock'; productTitle: string }>) {
        const { productId, type, productTitle } = action.payload;
        const existing = state.subscriptions.find(s => s.productId === productId && s.type === type);
        if (existing) {
            state.subscriptions = state.subscriptions.filter(s => s.id !== existing.id);
        } else {
            const newSub: NotificationSubscription = {
                id: `n${Date.now()}`,
                productId,
                productTitle,
                type,
                status: 'active'
            };
            state.subscriptions.push(newSub);
        }
    }
  },
});

export const { addSubscription, removeSubscription, toggleSubscription } = notificationSlice.actions;

export default notificationSlice.reducer;
