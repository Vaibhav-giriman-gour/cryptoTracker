import React from "react";

const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-red-800 bg-opacity-70 border border-red-600 text-red-100 px-4 py-4 rounded-md relative text-center shadow-lg animate-fadeIn mb-4">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline ml-2">
        {message || "Somthing went wrong, Please try again."}
      </span>
    </div>
  );
};

export default ErrorMessage;
