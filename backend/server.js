require('dotenv').config() // --- To load environment variables from .env file

// --- importing all the dependencies
const express = require('express')
const axios = require('axios')
const cors = require('cors')
const winston = require('winston'); // <--- FIX 1: ADD THIS IMPORT

const app = express()
const PORT = process.env.PORT || 5000 // --- using port as environment variable or 5000

// --- Configure winston logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        process.env.NODE_ENV === 'production'
            ? winston.format.json()
            : winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
    ],
    exceptionHandlers: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
    ],
    rejectionHandlers: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
    ],
});
// ----------------------------------------------------
// --- START OF CORS CONFIGURATION CHANGES ---
// ----------------------------------------------------

const allowedOrigins = [
    'http://localhost:5173', // For your local frontend development
    'https://crypto-tracker-six-pink.vercel.app' // <-- IMPORTANT: REPLACE WITH YOUR ACTUAL DEPLOYED VERCEL FRONTEND URL
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            // For better debugging, you might log the blocked origin
            logger.warn(`CORS block: Origin '${origin}' not allowed.`); 
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CMC_PRO_API_KEY'], // Specify allowed headers
    credentials: true // Allow cookies to be sent (if you ever use them, though unlikely for this app)
}));

// ----------------------------------------------------
// --- END OF CORS CONFIGURATION CHANGES ---
// ----------------------------------------------------

app.use(cors()) // --- Enabling CORS for the backend server
app.use(express.json())  // --- Allowing express to parse JSON data


// --- IMPORTANT
// --- Get the API KEY from the environment variable

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

// --- Base URL as per the Coin Market Cap API documentation
const BASE_URL = 'https://pro-api.coinmarketcap.com'

if (!COINMARKETCAP_API_KEY) {
    logger.error('CRITICAL ERROR: COINMARKETCAP_API_KEY is not set in the backend .env file or environment variables.');
} else {
    logger.info('CoinMarketCap API Key loaded successfully.');
}
// --- Proxy endpoint to fetch the latest Crypto Currencies
// --- NOTE: Frontend service will call http://localhost:5000/api/cryptocurrencies
// --- The communication will happen via the backend server
app.get('/api/cryptocurrencies', async (req, res) => {
    if (!COINMARKETCAP_API_KEY) {
        logger.error('Attempted API call without COINMARKETCAP_API_KEY set.');
        return res.status(500).json({ status: { error_message: 'Server configuration error: API Key is not maintained.' } })
    }
    try {
        // --- Endpoint path based on CoinMarket API Docs
        const response = await axios.get(`${BASE_URL}/v1/cryptocurrency/listings/latest`, {
            headers: {
                'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY, // --- Use the API key securely from backend
                'Accept': 'application/json',
            },
            params: {
                start: 1,
                limit: 100, // --- To fetch Top 100 Cryptocurrencies
                sort: "market_cap", // --- Sorting by market_cap
                sort_dir: "desc", // --- in descending order
                convert: "USD", // --- Convert all to the USD by default
            }
        })
        // --- Now the fetched data to the frontend API service
        logger.info('Successfully fetched latest cryptocurrencies from CoinMarketCap.');
        res.json(response.data)
    } catch (error) {
        const errorMessage = error.response?.data?.status?.error_message || error.message;
        const statusCode = error.response?.status || 500;
        logger.error(`Error fetching cryptocurrencies from CoinMarketCap: Status ${statusCode}, Message: ${errorMessage}`, {
            requestUrl: error.config?.url,
            requestParams: error.config?.params,
            responseStatus: statusCode,
            responseData: error.response?.data,
            stack: error.stack
        });
        res.status(statusCode).json(error.response?.data || { status: { error_message: 'Failed to fetch cryptocurrencies from the external API.' } })
    }
})

// --- Proxy endpoint to convert the Crypto Currencies
app.get('/api/convert', async (req, res) => {
    if (!COINMARKETCAP_API_KEY) {
        logger.error('Attempted conversion without COINMARKETCAP_API_KEY set.');
        return res.status(500).json({ status: { error_message: 'Server configuration error: API Key is not maintained.' } })
    }
    // --- Extract parameters from the frontend service/query
    const { amount, id, convert } = req.query;

    // --- Basic validation
    if (!amount || !id || !convert) {
        logger.warn(`Missing parameters for crypto conversion: amount=${amount}, id=${id}, convert=${convert}`);
        return res.status(400).json({ status: { error_message: 'Missing required parameters: amount, id, convert.' } });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        logger.warn(`Invalid amount provided for conversion: ${amount}`);
        return res.status(400).json({ status: { error_message: 'Invalid amount. Must be a positive number.' } });
    }
    try {
        const response = await axios.get(`${BASE_URL}/v2/tools/price-conversion`, {
            headers: {
                'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY, // --- Use the API key securely from backend
                'Accept': 'application/json',
            },
            params: {
                amount: parsedAmount, // Already parsed as number
                id: parseInt(id), // <--- FIX 2: Use 'id' and ensure it's an integer
                convert: convert.toUpperCase(), // --- Ensure symbols are uppercase for CMC API
            }
        })
        // --- Now the fetched data to the frontend API service
        logger.info(`Successfully converted ${parsedAmount} (ID: ${id}) to ${convert} using CoinMarketCap.`);
        res.json(response.data)
    } catch (error) {
        const errorMessage = error.response?.data?.status?.error_message || error.message;
        const statusCode = error.response?.status || 500;
        logger.error(`Error during crypto price conversion from CoinMarketCap: Status ${statusCode}, Message: ${errorMessage}`, {
            requestUrl: error.config?.url,
            requestParams: error.config?.params,
            responseStatus: statusCode,
            responseData: error.response?.data,
            stack: error.stack
        });
        res.status(statusCode).json(error.response?.data || { status: { error_message: 'Failed to convert crypto currencies from the external API.' } })
    }
})

// --- Start the server and listen for incoming requests
app.listen(PORT, () => {
    logger.info(`Backend server running on http://localhost:${PORT}`);
    if (!COINMARKETCAP_API_KEY) {
        logger.warn('Warning: CoinMarketCap API key is missing. Crypto features may not work.');
    }
});