import axios from "axios";

// --- Points to the backend server port
const BASE_URL = "http://localhost:5000";

// --- API call using Axios
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    // --- Backend server will handle the CoinMarketCap API KEY securly
    // --- Request JSON response from the API
    Accept: "application/json",
  },
});

// --- To get the latest crypto currencies
export const getLatestCryptoCurr = async () => {
  try {
    // --- Enpoint path on backend proxy (matches: api/cryptocurrencies)
    const response = await api.get("/api/cryptocurrencies");
    return response;
  } catch (error) {
    console.error(
      "Error in fetching the latest crypto curtrencies (getLatestCryptoCurr):",
      error.response?.data || error.message
    );
    throw error;
  }
};

// --- To convert the crypto currencies
export const getCryptoPriceConversion = async (amount, id, convert) => {
  try {
    // --- Enpoint path on backend (matched: 'api/convert')
    const response = await api.get("/api/convert", {
      params: {
        amount: amount,
        id: id, // --- Backend will handle
        convert: convert // --- Backend will handle
      },
    });
    return response;
  } catch (error) {
    console.error(
      "Error while price conversion(getCryptoPriceConversion):",
      error.response?.data || error.message
    );
    throw error;
  }
};
