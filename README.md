# CryptoTracker: Real-time Cryptocurrency Tracking & Conversion 📈

## Project Overview

CryptoTracker is a modern, responsive web application designed to provide users with up-to-date cryptocurrency market data and a convenient tool for currency conversion. Built with a focus on performance and user experience, it leverages the power of React, Redux Toolkit, and Tailwind CSS to deliver a fast and intuitive interface.

The application fetches the latest cryptocurrency listings from the CoinMarketCap API, displays them in a paginated format, and allows users to convert amounts between various cryptocurrencies and fiat currencies (like USD).

## Features ✨

* **Cryptocurrency Listings:** View a list of top cryptocurrencies with their current price, 24-hour, and 7-day percentage changes.
* **Frontend Pagination:** Efficiently browse through large datasets of cryptocurrencies with smooth "Next" and "Previous" page navigation.
* **Crypto Converter:** Convert amounts between any two listed cryptocurrencies or between a cryptocurrency and USD.
* **Responsive Design:** Optimized for seamless viewing and interaction across various devices (mobile, tablet, desktop) using Tailwind CSS.
* **Modern State Management:** Utilizes Redux Toolkit for predictable and centralized application state management.
* **User-Friendly Notifications:** Employs `react-hot-toast` for non-intrusive success, error, and validation messages.
* **Optimized Performance:** Implements lazy loading for route-based components to improve initial page load times and `React.memo` for efficient component re-renders.

## Technologies Used 🛠️

### Frontend
* **React.js:** A JavaScript library for building user interfaces.
* **Vite:** A fast frontend build tool that provides a lightning-fast development experience.
* **Redux Toolkit:** The official, opinionated, batteries-included toolset for efficient Redux development.
* **React Router:** For declarative routing within the Single Page Application (SPA).
* **Tailwind CSS:** A utility-first CSS framework for rapid and custom UI development.
* **Axios:** A promise-based HTTP client for making API requests.
* **`react-hot-toast`:** A library for beautiful and accessible toast notifications.

### API
* **CoinMarketCap API:** Provides comprehensive cryptocurrency data, including listings and conversion rates.

## Architecture & Design Choices 🏗️

The CryptoTracker application follows a client-side heavy architecture, with a clear separation of concerns and a focus on performance.

* **Component-Based UI (React):** The application's interface is broken down into small, reusable React components, promoting modularity and easier maintenance.
* **Centralized State Management (Redux Toolkit):** All global application state (cryptocurrency data, loading status, errors, conversion results, pagination details) is managed within a Redux store. This ensures a single source of truth and predictable state changes, especially important for managing data fetched from external APIs.
* **Optimized Data Fetching:**
    * For cryptocurrency listings, the application fetches a larger dataset (e.g., 100 items) from the CoinMarketCap API **once** on initial load.
    * **Frontend Pagination:** Instead of making new API calls for every page change, pagination is handled entirely on the frontend by slicing the already fetched data stored in the Redux store. This significantly reduces network requests and improves responsiveness when navigating between pages.
* **Code Splitting & Lazy Loading (`React.lazy`, `Suspense`):** To enhance initial load performance, route-based components (`HomePage`, `CryptoConverter`) are lazy-loaded. Their JavaScript bundles are only fetched when the user navigates to those specific routes, minimizing the initial download size.
* **Memoization (`React.memo`):** Components like `CryptoCard` and `CryptoConverter` are wrapped with `React.memo`. This Higher-Order Component prevents unnecessary re-renders of these functional components if their props (shallowly) haven't changed, optimizing rendering performance.
* **API Proxy (Conceptual):** While this version directly calls the CoinMarketCap API from the frontend (using environment variables for the API key), for a truly production-grade application, a simple Node.js/Express.js backend would serve as a proxy. This would hide the API key from the client-side bundle and allow for server-side rate limiting and more robust error handling. For this assignment, simplicity and meeting core requirements were prioritized.
* **Styling (Tailwind CSS):** Tailwind's utility-first approach allows for highly customizable and responsive designs directly within the JSX, leading to faster development and consistent styling.

## Getting Started 🚀

Follow these steps to set up and run the CryptoTracker application locally.

1.  **Prerequisites:**
    * Node.js (v18 or higher)
    * npm (comes with Node.js)
    * Git

2.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url> # Replace with your actual GitHub repository URL
    cd crypto-tracker # Navigate to your project root
    ```

3.  **Install Dependencies:**
    Install the required Node.js packages for the application:
    ```bash
    npm install
    ```

4.  **Obtain CoinMarketCap API Key:**
    * Visit the [CoinMarketCap API website](https://coinmarketcap.com/api/) and register for a free developer account.
    * Generate your API Key from your dashboard.

5.  **Configure Environment Variables:**
    Create a file named `.env` in the **root directory** of your project (at the same level as `package.json`). Add your CoinMarketCap API key to it:
    ```
    # .env
    VITE_COINMARKETCAP_API_KEY=YOUR_API_KEY_HERE
    ```
    **Replace `YOUR_API_KEY_HERE` with the actual API key you obtained.**

6.  **Run the Application:**
    Start the development server:
    ```bash
    npm run dev
    ```
    The application should now be accessible in your browser at `http://localhost:5173` (or another port if 5173 is in use).

For detailed setup, building for production, and deployment instructions, please refer to [`documentation/SETUP.md`](./documentation/SETUP.md).

## Usage 💡

Once the application is running:

* **Homepage:** Displays a paginated list of top cryptocurrencies. Use the "Next" and "Previous" buttons to navigate through the pages. The "Refresh Data" button fetches the latest data from the API.
* **Converter Page:** Navigate to the "Converter" link in the navigation bar.
    * Enter an amount.
    * Select a "From" currency (cryptocurrency).
    * Select a "To" currency (cryptocurrency or USD).
    * Click "Convert" to see the conversion result.
    * Use the swap button to quickly exchange "From" and "To" currencies.
* **Notifications:** Success messages, validation errors, and API errors will appear as non-intrusive toast notifications.

## Project Structure 📁

Here's a breakdown of the project's directory structure:
.

├── documentation/          # 📚 Project documentation, guides, and notes

│   ├── README.md           # 📄 This file: Project overview and main documentation

│   ├── SETUP.md            # ⚙️ Detailed setup and deployment instructions

│   ├── ASSUMPTIONS.md      # 🤔 Assumptions made during development

│   └── TODO.md             # 📝 Future enhancements and improvements

├── public/                 # 🌐 Static assets served directly (e.g., index.html, favicon)

├── src/                    # 💻 Main application source code

│   ├── assets/             # 🖼️ Images, icons, and other static media

│   │   └── placeholder-logo.png

│   ├── components/         # 🧩 Reusable UI components (e.g., buttons, cards, spinners)

│   │   ├── CryptoCard.jsx

│   │   ├── ErrorMessage.jsx

│   │   └── Loading.jsx     # Renamed from LoadingSpinner for consistency with your usage

│   ├── pages/              # 📄 Top-level components representing distinct views/pages

│   │   ├── CryptoConverter.jsx

│   │   └── HomePage.jsx

│   ├── redux/              # ⚛️ Redux store setup and slices (state management logic)

│   │   ├── cryptoSlice.js

│   │   └── store.js

│   ├── services/           # 🔗 API interaction logic (Axios instance, API calls)

│   │   └── cryptoApi.js

│   ├── utils/              # 💡 Utility functions and helpers

│   │   ├── format.js       # For currency and percentage formatting

│   │   └── helpers.js      # Other general helper functions

│   ├── App.jsx             # 🚀 Main application component, handles routing and global setup

│   ├── index.css           # 🎨 Global styles and Tailwind CSS imports

│   └── main.jsx            # 📦 React application entry point

├── .env.example            # 🔑 Example environment variables file (for API keys)

├── package.json            # 📜 Project dependencies and scripts

├── postcss.config.js       # ⚙️ PostCSS configuration for Tailwind

├── tailwind.config.js      # 🎨 Tailwind CSS configuration

└── vite.config.js          # ⚡ Vite build tool configuration