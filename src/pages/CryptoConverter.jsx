import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCryptos,
  convertCrypto,
  clearConversionResult,
} from "../redux/cryptoSlice";
import { formatCurrency } from "../utils/format"; // Assuming formatCurrency utility exists
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage"; // Assuming ErrorMessage component exists
import toast from "react-hot-toast"; // Assuming react-hot-toast is installed

const CryptoConverter = () => {
  const dispatch = useDispatch();
  const { cryptos, conversionResult, loading, error, allCryptos } = useSelector(
    (state) => state.crypto
  );

  // --- Local states to manage form inputs
  const [amount, setAmount] = useState("");
  const [toCurrency, setToCurrency] = useState("USD");
  const [selectedFromCryptoId, setSelectedFromCryptoId] = useState("");
  const [selectedFromCryptoSymbol, setSelectedFromCryptoSymbol] = useState("");

  // --- useEffect hook to fetch cryptocurrencies for the dropdowns.
  useEffect(() => {
    if (allCryptos.length === 0) {
      dispatch(fetchCryptos());
    }
  }, [dispatch, allCryptos.length]);

  // --- For Cleanup
  useEffect(() => {
    return () => {
      dispatch(clearConversionResult());
    };
  }, [dispatch]);

  // --- useEffect to show Redux errors as toasts
  useEffect(() => {
    if (error) {
      toast.error(`API Error: ${error}`);
    }
  }, [error]);

  useEffect(() => {
    if (conversionResult) {
      console.log("conversionResult:", conversionResult);
    }
  }, [conversionResult]);

  const handleFromCurrencyChange = (e) => {
    const selectedId = e.target.value;
    setSelectedFromCryptoId(selectedId);

    const selectedCrypto = allCryptos.find(
      (crypto) => String(crypto.id) === selectedId
    );
    if (selectedCrypto) {
      setSelectedFromCryptoSymbol(selectedCrypto.symbol);
    } else {
      setSelectedFromCryptoSymbol("");
    }
    dispatch(clearConversionResult());
  };

  // Removed the handleSwapCurrencies function and its button
  // as it required a more complex refactor for the ID/symbol separation.

  const handleConvert = (e) => {
    e.preventDefault();

    // --- Basic input validation using toast notifications
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount (a positive number).");
      return;
    }
    if (!selectedFromCryptoId || !toCurrency) {
      toast.error("Please select both 'From' and 'To' currencies.");
      return;
    }

    // --- Dispatch the `convertCrypto` async thunk
    dispatch(
      convertCrypto({
        amount: parseFloat(amount),
        id: selectedFromCryptoId,
        convert: toCurrency,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Conversion successful!");
      })
      .catch((err) => {
        // More robust error message display from thunk payload
        const errorMessage =
          err.message ||
          err.status?.error_message ||
          "An unknown error occurred.";
        toast.error(`Conversion failed: ${errorMessage}`);
      });
  };

  // --- Prepare options for the 'From' currency dropdown.
  const fromCurrencyOptions = allCryptos.map((c) => ({
    id: c.id,
    symbol: c.symbol,
    name: c.name,
  }));

  // --- Prepare options for the 'To' currency dropdown.
  const allConversionOptions = [
    { id: "USD", symbol: "USD", name: "US Dollar" }, // Added dummy ID for consistency
    ...fromCurrencyOptions,
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
            }}
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
            value={selectedFromCryptoId}
            onChange={handleFromCurrencyChange}
            className="shadow border rounded-lg w-full py-3 px-4 text-gray-200 leading-tight
                         focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                         bg-gray-700 border-gray-600"
            required
          >
            <option value="">Select currency</option>
            {fromCurrencyOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name} ({option.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Removed Swap Currencies Button */}

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
              amount * conversionResult // <-- This will now correctly use the numerical price
            )}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {amount} {selectedFromCryptoSymbol} ={" "}
            {formatCurrency(
              amount * conversionResult // <-- This will now correctly use the numerical price
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
