import React from "react";
// ---  Importing the Format functions from format.js
import {
  formatCurrency,
  formatPercentage,
  getChangeColor,
  getCryptoLogoUrl,
  handleImageError,
} from "../utils/format";
const CryptoCard = ({ crypto }) => {
  const {
    id,
    name,
    symbol,
    quote: {
      USD: { price, percent_change_24h, percent_change_7d },
    },
  } = crypto;
  const logoURL = getCryptoLogoUrl(id); // --- Logo function from the format.jsx component
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-4 m-2 flex flex-col items-center justify-between transform transition-transform duration-300 hover:shadow-2xl animate-fadeIn border border-gray-600 hover:border-teal-700">
      {/* For cryptoCurrencies Logos*/}
      <img
        src={logoURL} // --- getting the url form the format component getCryptoLogoURL function
        alt={`${name} logo`}
        className="w-16 h-16 md-3 rounded-md object-cover border-2 border-gray-500"
        onError={handleImageError} // --- Error handling cfunction from the format component
      />
      {/* Title and logo of the CryptoCurrencies*/}
      <h3 className="text-xl font-semibold text-teal-400 mb-1 text-center">
        {name} ({symbol})
      </h3>
      {/* Current Price */}
      <p className="text-gray-200 text-lg font-bold mb-2">
        {formatCurrency(price)}
      </p>
      {/* 24-hour change */}
      <div className="w-full text-center mb-2">
        <p className="text-sm text-gray-400">24h Change:</p>
        {/* Apply color and percentage for the cryptocurrencies*/}
        <p
          className={`text-md font-medium ${getChangeColor(
            percent_change_24h
          )}`}
        >
        {/* Percentage function from the format.jsx component*/}
          {formatPercentage(percent_change_24h)} 
        </p>
      </div>
      {/* 7-Day changes*/}
      <div className="w-full text-center mb-2">
        <p className="text-sm text-gray-400">24h Change:</p>
        {/* Apply color and percentage for the cryptocurrencies*/}
        <p
          className={`text-md font-medium ${getChangeColor(percent_change_7d)}`}
        >
        {/* Percentage function from the format.jsx component*/}
          {formatPercentage(percent_change_7d)}
        </p>
      </div>
    </div>
  );
};

export default React.memo(CryptoCard);
