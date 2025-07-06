import React, { useEffect } from "react";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import CryptoCard from "../components/CryptoCard";
import { useSelector, useDispatch } from "react-redux";
import { fetchCryptos, setCurrentPage } from "../redux/cryptoSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const { loading, error, cryptos, currentPage, itemsPerPage, totalItems } =
    useSelector((state) => state.crypto);
  // --- Calculate total pages based on totalItems and itemsPerPage
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  // --- fetchCryptos is a async Thunk, it will take care of loading status, API call, fetching cryptos details and show error in case of errors
  useEffect(() => {
    dispatch(fetchCryptos({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch]); // --- Putting the dependency on the dispatch, currentPage and itemsPerPage whenever it changes the useEffect will trigger

  // --- To handle refresh, calls the fetchCryptos (async thunk) to get the latest data from the API
  const handleRefresh = () => {
    dispatch(fetchCryptos({ page: currentPage, limit: itemsPerPage }));
  };
  // --- `handleNextPage` moves to the next page of cryptocurrency data.
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };
  // --- `handlePrevPage` moves to the previous page of cryptocurrency data.
  const handlePrevPage = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-xl animate-fadeIn">
      {/* Header Section: Title and Refresh button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-0">
          Top Crypto Currencies
        </h1>
        <button
          onClick={handleRefresh}
          className="bg-teal-600 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-75 shadow-md hover:shadow-lg animate-bounceOnce" // Apply Tailwind styles and custom animation
          disabled={loading} // Disable the button while data is being fetched to prevent multiple requests
          aria-label={
            loading ? "Refreshing data" : "Refresh cryptocurrency data"
          }
        >
          {loading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>
      {/* Display Error message if any error occurred during the data fetching */}
      {error && <ErrorMessage message={error} />}
      {/* Display Loading animation while data is getting fetched */}
      {loading && <Loading />}
      {/* If no data is available displaying the below message */}
      {!loading && cryptos.length === 0 && !error && (
        <p className="text-center text-gray-400 text-lg py-8">
          No Crypto Currencies are available. Please try Refreshing or check
          your API key
        </p>
      )}
      {/* Displaying the crypto currencies in grid once data is fetched successfully*/}
      {!loading && cryptos.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {cryptos.map((cryps) => (
              <CryptoCard key={cryps.id} crypto={cryps} />
            ))}
          </div>
          {/* Pagination Control */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={handlePrevPage}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-2 px-4 rounded-lg
                            transition duration-300 ease-in-out transform hover:scale-105
                            focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75
                            shadow-md"
              disabled={loading || currentPage === 1} // Disable if loading or on first page
              aria-label="Previous page"
            >
              Previous
            </button>
            <span className="text-lg text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-2 px-4 rounded-lg
                            transition duration-300 ease-in-out transform hover:scale-105
                            focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75
                            shadow-md"
              disabled={loading || currentPage === totalPages} // Disable if loading or on last page
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(HomePage);
