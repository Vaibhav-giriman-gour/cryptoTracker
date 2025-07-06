# Assumptions for CryptoTracker App

This document outlines the key assumptions made during the development of the CryptoTracker application.

1.  **CoinMarketCap API Availability and Structure:**
    * It is assumed that the CoinMarketCap API (`https://pro-api.coinmarketcap.com/v1` and `/v2` endpoints) is publicly accessible and provides the necessary endpoints and data structure for fetching cryptocurrency listings and conversion rates as documented.
    * Specifically, it's assumed that the `listings/latest` endpoint provides `id`, `name`, `symbol`, and `quote.USD` data, and the `tools/price-conversion` endpoint provides the `data[fromSymbol].quote[toSymbol].price` structure.
    * **Note:** The free tier of CoinMarketCap API might have rate limits or limited data. For this project, we assume the available data and rate limits are sufficient for demonstration purposes.

2.  **API Key Security:**
    * The CoinMarketCap API key is expected to be provided via environment variables (`VITE_COINMARKETCAP_API_KEY`).
    * **Assumption:** For a client-side application, while environment variables help during development and build, the API key will still be exposed in the client-side JavaScript bundle. For a truly production-grade application handling sensitive API keys or requiring strict rate-limit management, a backend proxy would be necessary to hide the key and control access. This project prioritizes simplicity for demonstration.

3.  **Data Freshness:**
    * The application fetches data from the CoinMarketCap API on component mount or when manually refreshed. There is no real-time WebSocket integration for live updates. Data freshness depends on the API's update frequency and the application's refresh mechanism.

4.  **Mobile-First Responsiveness:**
    * The application is designed with a mobile-first approach using Tailwind CSS's responsive utilities. It is assumed that the UI will adapt gracefully to various screen sizes (mobile, tablet, desktop).

5.  **Error Handling:**
    * Basic error handling for API failures (e.g., network issues, invalid API key, rate limits) is implemented using Redux state and `react-hot-toast` to display user-friendly messages. More granular error logging and reporting mechanisms are not included in this initial version.

6.  **No User Authentication/Persistence:**
    * The application does not include user authentication, user profiles, or data persistence (e.g., saving favorite cryptocurrencies). It's a read-only data display and conversion tool.

7.  **No Advanced Charting:**
    * The problem statement focuses on displaying current values and changes. Advanced charting (e.g., historical price data graphs) is not included.

8.  **Third-Party Library Availability:**
    * It's assumed that the CDN links for Google Fonts (Inter) and other libraries (like Axios, React, Redux, React Router, `react-hot-toast`) will remain stable and accessible.