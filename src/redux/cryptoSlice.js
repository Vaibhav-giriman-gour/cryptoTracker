import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getLatestCryptoCurr,
    getCryptoPriceConversion,
} from "../services/cryptoApi";

// --- Thunk for fetching the latest cryptocurrency data.
// --- This will be used by the HomePage component.
export const fetchCryptos = createAsyncThunk(
    "crypto/fetchCryptos",
    async (_, { rejectWithValue }) => {
        try {
            // --- Call the API service function to get the data.
            const response = await getLatestCryptoCurr();
            return {
                data: response.data.data, // This will be the array of all 100 cryptocurrencies
                totalItems: response.data.status.total_count, // Total count from CoinMarketCap
            };
        } catch (error) {
            console.error(
                "Error fetching cryptocurrencies:",
                error.response?.data || error.message
            );
            return (
                rejectWithValue(error.response?.data?.status?.error_message ||
                    "Failed to fetch cryptocurrencies")
            );
        }
    }
);
// --- Thunk for performing cryptocurrency conversion.
// --- This will be used by the CryptoConverter component.
export const convertCrypto = createAsyncThunk(
    "crypto/convertCrypto",
    async ({ amount, symbol, convert }, { rejectWithValue }) => {
        try {
            const response = await getCryptoPriceConversion(amount, symbol, convert);
            return response.data.data;
        } catch (error) {
            console.error(
                "Error Converting the cryptocurrencies:",
                error.response?.data || error.response
            );
            return (
                rejectWithValue(error.response?.data?.status?.error_message ||
                    "Failed to convert the crypto currencies")
            );
        }
    }
);

const cryptoSlice = createSlice({
    name: "crypto",
    initialState: {
        allCryptos: [], // --- Store ALL fetched cryptocurrencies here
        cryptos: [], // --- This will store the currently displayed (paginated) cryptocurrencies
        conversionResult: null,
        loading: false,
        error: null,
        currentPage: 1, // --- Current page number, starts at 1
        itemsPerPage: 10, // --- Number of items to display per page
        totalItems: 0, // --- Total number of items available from the API (for calculating total pages)
    },
    reducers: {
        clearConversionResult: (state) => {
            (state.conversionResult = null), (state.error = null);
        },
        // Reducer to update the current page and slice the data for display
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
            // Calculate the start and end index for slicing the allCryptos array
            const startIndex = (state.currentPage - 1) * state.itemsPerPage;
            const endIndex = startIndex + state.itemsPerPage;
            state.cryptos = state.allCryptos.slice(startIndex, endIndex); // Slice the data for the current page
        },
    },
    // --- * The `builder` object provides methods to add cases for different action types.
    extraReducers: (builder) => {
        builder
            // ---- For fetchCryptos
            .addCase(fetchCryptos.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchCryptos.fulfilled, (state, action) => {
                state.loading = false;
                state.allCryptos = action.payload.data;
                state.totalItems = action.payload.totalItems; // --- Update total items
                // Initialize cryptos for the first page
                const startIndex = (state.currentPage - 1) * state.itemsPerPage;
                const endIndex = startIndex + state.itemsPerPage;
                state.cryptos = state.allCryptos.slice(startIndex, endIndex); // Display first page
            })
            .addCase(fetchCryptos.rejected, (state, action) => {
                state.loading = false;
                state.cryptos = []; // --- Clear displayed cryptos on error
                state.allCryptos = []; // --- Clear all cryptos on error
                state.error = action.payload;
                state.totalItems = 0; // --- Reset total items on error
            })
            // --- For convertCrypto
            .addCase(convertCrypto.pending, (state) => {
                state.loading = true; // Set loading to true when the conversion operation starts.
                state.error = null; // Clear any previous error messages.
                state.conversionResult = null; // Clear any previous conversion result.
            })
            .addCase(convertCrypto.fulfilled, (state, action) => {
                state.loading = false;
                state.conversionResult = action.payload;
            })
            .addCase(convertCrypto.rejected, (state, action) => {
                state.loading = false
                state.conversionResult = null;
                state.error = action.payload
            });
    },
});

export const { clearConversionResult, setCurrentPage } = cryptoSlice.actions;

export default cryptoSlice.reducer;
