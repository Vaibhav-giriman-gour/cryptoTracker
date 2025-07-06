# TODO List for CryptoTracker App

This document outlines potential future enhancements and areas for improvement for the CryptoTracker application.

## High Priority

* **Implement Robust Error Boundaries:** Add React Error Boundaries to gracefully handle rendering errors in components, preventing the entire application from crashing.
* **API Rate Limit Handling:** Implement more sophisticated handling for CoinMarketCap API rate limits, including retry mechanisms or user notifications specifically for rate limits.
* **Loading Skeletons:** Replace simple loading spinners with content-aware loading skeletons for a better user experience, especially on the Homepage, to indicate content structure while loading.
* **Comprehensive Input Validation for Converter:** Enhance input validation on the CryptoConverter form to provide immediate feedback (e.g., inline error messages) rather than just toast notifications, improving usability.

## Medium Priority

* **Search/Filter Functionality:** Add a search bar to the Homepage to allow users to quickly find specific cryptocurrencies by name or symbol.
* **Pagination on Homepage:** Implement proper pagination controls (Next/Previous buttons, page numbers) on the Homepage to navigate through the list of cryptocurrencies more effectively, as the current implementation fetches all 100 but only displays the first 10. (Note: The frontend slicing logic is in place, just needs UI controls).
* **User Preferences (Local Storage):** Allow users to save their preferred base currency for conversion or display (e.g., default 'To' currency in Converter) using local storage.
* **Accessibility (A11y) Improvements:** Enhance accessibility for screen readers and keyboard navigation (e.g., ARIA attributes, focus management across the entire application).

## Low Priority / Future Ideas

* **Historical Data Charts:** Integrate a charting library (e.g., Recharts, Chart.js) to display historical price data for cryptocurrencies on individual crypto detail pages (if implemented).
* **Backend Proxy:** Implement a Node.js/Express.js backend to proxy CoinMarketCap API requests. This would hide the API key, allow for server-side rate limiting, and potentially enable more complex server-side logic and database interactions.
* **User Authentication:** Implement user authentication (e.g., Firebase Auth) to allow users to save favorite cryptocurrencies or manage a portfolio.
* **Real-time Updates:** Explore WebSocket integration (if CoinMarketCap offers it or via a custom backend) for more real-time price updates.
* **Notifications:** Implement browser notifications for significant price changes of user-selected cryptocurrencies.
* **Internationalization (i18n):** Support multiple languages and currency formats based on user locale.
* **Automated Tests:** Write comprehensive unit, integration, and end-to-end tests for the entire application using frameworks like Jest, React Testing Library, and Cypress/Playwright.
