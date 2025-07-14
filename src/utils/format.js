export const formatCurrency = (value) => {
  // --- Check if the value is null, undefined, or not a number.
  if (value === null || value === undefined || isNaN(value)) {
    return "$0.00";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency", // --- Format as currency
    currency: "USD", // --- Use US Dollar currency code
    minimumFractionDigits: 2, // --- Always show at least two decimal places
    maximumFractionDigits: 2, // --- Allow up to 8 decimal places for precise crypto values
  }).format(value);
};

export const formatPercentage = (value) => {
  // --- Check if the value is null, undefined, or not a number.
  if (value === null || value === undefined || isNaN(value)) {
    return "0.00%";
  }
  // --- Use toFixed(2) to round to two decimal places and append the '%' sign.
  return `${value.toFixed(2)}%`;
};

export const getChangeColor = (change) => {
  if (change > 0) {
    return "text-green-400"; // ---Green for positive change
  } else if (change < 0) {
    return "text-red-400"; // --- Red for negative change
  }
  return "text-gray-400"; // --- Gray for no change or invalid input
};

export const getCryptoLogoUrl = (id) => {
  // --- URL format: https://s2.coinmarketcap.com/static/img/coins/64x64/1.png
  return `https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`;
};

export const handleImageError = (event) => {
  // --- Ensure you have a `logo.png` file in `frontend/src/assets/`.
  event.target.src = "/assets/placeholder-logo.png";
  // --- Update the alt text for accessibility when the logo is not available.
  event.target.alt = "Logo not available";
};
