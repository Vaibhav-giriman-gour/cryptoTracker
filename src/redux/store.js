import { configureStore } from "@reduxjs/toolkit";
import cryptoReducer from './cryptoSlice';

// --- configuring store for 
const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
  },
});

export default store;