require('dotenv').config() // --- To load enviroment variables from .env file

// --- importing all the dependencies
const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000 // --- using port as enviroment variable or 5000

app.use(cors()) // --- Enabling CORS for the backend server
app.use(express.json())  // --- Allowing express to parse JSON data

// --- IMPORTANT
// --- Get the API KEY from the enviorment variable

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

// --- Base URL as per the Coin Market Cap API documentation
const BASE_URL = 'https://pro-api.coinmarketcap.com'

// --- Proxy endpoint to fecth the lastest Crypto Currencies
// --- NOTE: Frontend service will call http://localhost:5000/api/cryptocurrencies 
// --- The comunication will happen via the backend server
app.get('/api/cryptocurrencies', async (req, res) => {
    if (!COINMARKETCAP_API_KEY) {
        console.error('COINMARKETCAP API KEY is not set in the backend .env file!');
        return res.status(500).json({ status: { error_message: 'Server configuration error: API KEY is not maintained' } })
    }
    try {
        // --- Enpoint path based on CoinMarket API Docs
        const response = await axios.get(`${BASE_URL}/v1/cryptocurrency/listings/latest`, {
            headers: {
                'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY, // --- Use the API key securely from backend
                'Accept': 'application/json',
            },
            params: {
                start: 1,
                limit: 100, // --- To fetch Top 100 Cryptocurrencies
                sort: "market_cap", // --- Sortin by market_cap
                sort_dir: "desc", // --- in desending order
                convert: "USD", // --- Covert all to the USD by default
            }
        })
        // --- Now the fetched data to the frontend API service
        res.json(response.data)
    } catch (error) {
        console.error('Error Fetching the Cryptio Currencies from COINMARKETCAP', error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { status: { error_message: 'Failed to fetch the Crypto Currencies from the external API.' } })
    }
})

// --- Proxy endpoint to convert the Crypto Currencies
app.get('/api/convert', async (req, res) => {
    if (!COINMARKETCAP_API_KEY) {
        // --- Enpoint path based on CoinMarket API Docs
        console.error('COINMARKETCAP API KEY is not set in the backend .env file!');
        return res.status(500).json({ status: { error_message: 'Server configuration error: API KEY is not maintained' } })
    }
    // --- Extract parameters from the frontend service/query
    const { amount, symbol, convert } = req.query;

    // --- Basic validation 
    if (!amount || !symbol || !convert) {
        return res.status(400).json({ status: { error_message: "Missing required parameters: amount, symbol, convert." } });
    }
    try {
        const response = await axios.get(`${BASE_URL}/v2/tools/price-conversion`, {
            headers: {
                'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY, // --- Use the API key securely from backend
                'Accept': 'application/json',
            },
            params: {
                amount: parseFloat(amount), // --- Ensure amount is parsed as a number
                symbol: symbol.toUpperCase(), // --- Ensure symbols are uppercase for CMC API
                convert: convert.toUpperCase(), // --- Ensure symbols are uppercase for CMC API
            }
        })
        // --- Now the fetched data to the frontend API service
        res.json(response.data)
    } catch (error) {
        console.error('Error Fetching the Crypto Currencies from COINMARKETCAP', error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { status: { error_message: 'Failed to convert the Crypto Currencies from the external API.' } })
    }
})

// --- Start the server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});