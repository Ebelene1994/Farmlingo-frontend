import { useState } from 'react';

export default function VirtualFarm() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className='w-full h-screen flex justify-center items-center relative'>
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4" />
          <p className="text-gray-600">Loading Virtual Farm...</p>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
          <div className="text-red-500 font-medium mb-2">Failed to load Virtual Farm</div>
          <p className="text-gray-600 mb-4">Please check your internet connection</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      )}

      <iframe
        src='https://backend-mvp-43nd.onrender.com/'
        title='Virtual Farm'
        className='w-full h-screen'
        allowFullScreen
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}
