import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCryptos,
  convertCrypto,
  clearConversionResult,
} from "../redux/cryptoSlice";
import { formatCurrency } from "../utils/format";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import toast from "react-hot-toast";

const CryptoConverter = () => {
  const dispatch = useDispatch();
  const { cryptos, conversionResult, loading, error } = useSelector(
    (state) => state.crypto
  );

  // --- loacal states to manage form inputs
  const [amount, setAmount] = useState("");
  const [toCurrency, setToCurrency] = useState("USD");
  const [fromCurrency, setFromCurrency] = useState("");

  // --- useEffect hook to fetch cryptocurrencies for the dropdowns.
  useEffect(() => {
    if (cryptos.length === 0) {
      dispatch(fetchCryptos());
    }
  }, [dispatch, cryptos.length]); // --- Dependencies: dispatch (stable), cryptos.length (to re-run if list changes)

  // --- For Cleanup
  useEffect(() => {
    // --- The return function acts as a cleanup mechanism
    return () => {
      dispatch(clearConversionResult());
    };
  }, [dispatch]); // --- Dependency: dispatch (stable)
  // --- useEffect to show Redux errors as toasts
  useEffect(() => {
    if (error) {
      toast.error(`API Error: ${error}`);
    }
  }, [error]); // --- Show toast when Redux 'error' state changes

  useEffect(() => {
    if (conversionResult) {
      console.log("conversionResult:", conversionResult);
    }
  }, [conversionResult]);

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    dispatch(clearConversionResult());
    toast.dismiss(); // Dismiss any currently visible toasts on swap
  };

  const handleConvert = (e) => {
    e.preventDefault();

    // --- Basic input validation using toast notifications
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount (a positive number).");
      return;
    }
    if (!fromCurrency || !toCurrency) {
      toast.error("Please select both 'From' and 'To' currencies.");
      return;
    }

    // --- Dispatch the `convertCrypto` async thunk
    dispatch(
      convertCrypto({
        amount: parseFloat(amount),
        symbol: fromCurrency,
        convert: toCurrency,
      })
    )
      .unwrap() // --- Use unwrap to handle fulfilled/rejected promises from thunk
      .then(() => {
        // --- Show success toast only if conversion was successful
        toast.success("Conversion successful!");
      })
      .catch((err) => {
        if (err.message !== error)
          toast.error(`Conversion failed: ${err.message}`);
      });
  };

  // --- Prepare options for the 'From' currency dropdown.
  const currencyOptions = cryptos.map((c) => ({
    symbol: c.symbol,
    name: c.name,
  }));

  // --- Prepare options for the 'To' currency dropdown.
  const allConversionOptions = [
    { symbol: "USD", name: "US Dollar" },
    ...currencyOptions,
  ];

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-xl animate-fadeIn">
      <h1 className="text-3xl md:text-4xl font-bold text-teal-400 mb-6 text-center">
        Crypto Converter
      </h1>
      <form onSubmit={handleConvert} className="space-y-6 max-w-md mx-auto">
        {/* Amount Input Field */}
        <div>
          <label
            htmlFor="amount"
            className="block text-gray-300 text-sm font-bold mb-2"
          >
            Amount:
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              dispatch(clearConversionResult());
            }} // --- No need to clear validationMessage here, toasts are transient
            placeholder="e.g., 1.5"
            step="any"
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-200 leading-tight
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                       bg-gray-700 border-gray-600 placeholder-gray-400"
            required
          />
        </div>

        {/* From Currency Dropdown */}
        <div>
          <label
            htmlFor="fromCurrency"
            className="block text-gray-300 text-sm font-bold mb-2"
          >
            From:
          </label>
          <select
            id="fromCurrency"
            value={fromCurrency}
            onChange={(e) => {
              setFromCurrency(e.target.value);
              dispatch(clearConversionResult());
            }}
            className="shadow border rounded-lg w-full py-3 px-4 text-gray-200 leading-tight
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                       bg-gray-700 border-gray-600"
            required
          >
            <option value="">Select currency</option>
            {cryptos.map((option) => (
              <option key={option.symbol} value={option.symbol}>
                {option.name} ({option.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Currencies Button */}
        <div className="flex justify-center my-4">
          <button
            type="button"
            onClick={handleSwapCurrencies}
            className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-2 px-4 rounded-full
                       transition duration-300 ease-in-out transform hover:scale-110
                       focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75
                       shadow-md"
            aria-label="Swap currencies"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </button>
        </div>

        {/* To Currency Dropdown */}
        <div>
          <label
            htmlFor="toCurrency"
            className="block text-gray-300 text-sm font-bold mb-2"
          >
            To:
          </label>
          <select
            id="toCurrency"
            value={toCurrency}
            onChange={(e) => {
              setToCurrency(e.target.value);
              dispatch(clearConversionResult());
            }}
            className="shadow border rounded-lg w-full py-3 px-4 text-gray-200 leading-tight
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                       bg-gray-700 border-gray-600"
            required
          >
            <option value="">Select currency</option>
            {allConversionOptions.map((option) => (
              <option key={option.symbol} value={option.symbol}>
                {option.name} ({option.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Convert Button */}
        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg
                     transition duration-300 ease-in-out transform hover:scale-105
                     focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-75
                     shadow-md hover:shadow-lg"
          disabled={loading}
        >
          {loading ? "Converting..." : "Convert"}
        </button>
      </form>

      {/* Conversion Result Display */}
      {conversionResult && (
        <div className="mt-8 p-6 bg-gray-700 rounded-lg shadow-inner text-center animate-fadeIn border border-teal-500">
          <h3 className="text-xl font-semibold text-teal-400 mb-3">
            Conversion Result:
          </h3>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(
              amount *
                conversionResult?.quote?.[toCurrency.toUpperCase()]?.price
            )}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {amount} {fromCurrency} ={" "}
            {formatCurrency(
              amount *
                conversionResult?.quote?.[toCurrency.toUpperCase()]?.price
            )}{" "}
            {toCurrency}
          </p>
        </div>
      )}

      {loading && <Loading />}
    </div>
  );
};

export default React.memo(CryptoConverter);
