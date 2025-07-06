// frontend/src/App.jsx
import React, { lazy, Suspense } from 'react';
// Import necessary components for routing from react-router-dom
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import your page components
const LazyHomePage = lazy(() => import('./pages/HomePage'));
const LazyCryptoConverter = lazy(() => import('./pages/CryptoConverter'));

/**
 * App component serves as the root of your React application.
 * It sets up the routing for different pages and includes a global navigation bar.
 */
function App() {
  return (
    // Router component enables client-side routing
    <Router>
      <div className="min-h-screen bg-gray-900 text-white font-inter">
        {/* Navigation Bar */}
        <nav className="bg-gray-800 p-4 shadow-lg">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
            {/* App Title/Logo which links to Home */}
            <Link to="/" className="text-2xl font-bold text-teal-400 hover:text-teal-300 transition duration-300 ease-in-out mb-3 sm:mb-0">
              CryptoTracker
            </Link>
            {/* Navigation Links */}
            <div className="flex space-x-4">
              <Link
                to="/" // Link to the HomePage
                className="nav-link-hover-animation px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition duration-300 ease-in-out"
              >
                Home
              </Link>
              <Link
                to="/converter" // Link to the CryptoConverter page
                className="nav-link-hover-animation px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition duration-300 ease-in-out"
              >
                Converter
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="container mx-auto p-4">
          {/* Suspense component is required when using React.lazy.
              It allows you to display a fallback UI (e.g., a loading spinner)
              while the lazy-loaded component is being fetched. */}
          <Suspense fallback={
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
              <p className="ml-4 text-lg text-teal-400">Loading page...</p>
            </div>
          }>
            {/* Routes component defines the different paths and their corresponding components */}
            <Routes>
              {/* Use the lazy-loaded components in your routes */}
              <Route path="/" element={<LazyHomePage />} /> {/* Route for the Home page */}
              <Route path="/converter" element={<LazyCryptoConverter />} /> {/* Route for the Converter page */}
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
