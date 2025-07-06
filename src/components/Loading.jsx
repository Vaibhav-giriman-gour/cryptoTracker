import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* A spinner element, styled to rotate in circle*/}
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
      {/* The text Content while loadin*/}
      <p className="mt-4 text-lg text-teal-400">Loading Data....</p>
    </div>
  );
};

export default Loading;
