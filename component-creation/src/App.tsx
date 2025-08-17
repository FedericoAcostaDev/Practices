import React, { useState, useEffect, useCallback } from 'react';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot, query, where, addDoc, getDocs } from 'firebase/firestore';

// --- TYPE DEFINITIONS (Interfaces) ---
// Define the props for our reusable Card component
interface CardProps {
  title: string;
  content: string;
  className?: string; // Optional CSS classes for customization
}

// Define the type for the data fetched from the API
interface Post {
  id: number;
  title: string;
  body: string;
}

// Define the state for the multi-page app
type Page = 'home' | 'data';

// --- REUSABLE CARD COMPONENT ---
// This component demonstrates props and state with TypeScript
const CardComponent: React.FC<CardProps> = ({ title, content, className }) => {
  // Use state to manage a simple click count, initialized to 0
  const [clickCount, setClickCount] = useState<number>(0);

  // Function to handle the button click and update the state
  const handleCardClick = () => {
    setClickCount(prevCount => prevCount + 1);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`
        bg-white p-6 rounded-xl shadow-lg
        transform transition-transform duration-200 hover:scale-105
        cursor-pointer
        ${className || ''}
      `}
    >
      {/* Title prop is strongly typed as a string */}
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      {/* Content prop is also strongly typed as a string */}
      <p className="text-gray-600 leading-relaxed mb-4">{content}</p>
      {/* State is used to display the click count */}
      <div className="text-sm text-gray-500">
        Clicked: {clickCount} time{clickCount !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

// --- DATA FETCHER COMPONENT ---
// This component demonstrates fetching data from an API and handling different states
const DataFetcherComponent: React.FC = () => {
  // State for the fetched data, explicitly typed as Post or null
  const [data, setData] = useState<Post | null>(null);
  // State for the loading status, explicitly typed as a boolean
  const [loading, setLoading] = useState<boolean>(true);
  // State for any error that might occur, explicitly typed as Error or null
  const [error, setError] = useState<Error | null>(null);

  // useEffect hook to perform the API call when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Set loading to true before the fetch begins
        setLoading(true);
        // Clear any previous errors
        setError(null);

        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');

        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON data and set the state
        const json = await response.json();
        setData(json);
      } catch (e: any) {
        // Catch any errors and update the error state
        setError(e);
        console.error("Failed to fetch data:", e);
      } finally {
        // This block always runs, so we set loading to false here
        setLoading(false);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures this effect runs only once on mount

  // Conditional rendering based on the component's state
  if (loading) {
    return <div className="text-center py-10 text-xl font-medium text-blue-500">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p className="text-2xl font-bold mb-2">Error!</p>
        <p className="text-sm">Could not fetch data. Please try again later.</p>
        <p className="text-xs italic mt-1">Error message: {error.message}</p>
      </div>
    );
  }

  // Once data is loaded and there are no errors, display it
  return (
    <CardComponent
      title={data?.title || 'No Title'}
      content={data?.body || 'No content found.'}
      className="max-w-xl mx-auto"
    />
  );
};

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans antialiased flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">React & TypeScript Exercise</h1>
        <p className="text-lg text-gray-600">
          This app demonstrates a reusable component and an API data fetcher with proper typing.
        </p>
      </div>

      <nav className="flex space-x-4 mb-8">
        <button
          onClick={() => setCurrentPage('home')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentPage === 'home'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Reusable Component
        </button>
        <button
          onClick={() => setCurrentPage('data')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentPage === 'data'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          API Fetcher
        </button>
      </nav>

      <div className="w-full max-w-4xl mx-auto">
        {(() => {
          switch (currentPage) {
            case 'home':
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Reusable Card component, used multiple times with different props */}
                  <CardComponent
                    title="Introduction to Components"
                    content="This card is a reusable component. It takes a title and content as props and has its own internal state."
                  />
                  <CardComponent
                    title="TypeScript in Action"
                    content="Props for this component are strictly typed using a TypeScript interface, ensuring we pass the correct data types."
                  />
                  <CardComponent
                    title="Local State Example"
                    content="Clicking this card updates its local state (the click count) without affecting the other cards."
                  />
                </div>
              );
            case 'data':
              return (
                <div className="flex justify-center">
                  <DataFetcherComponent />
                </div>
              );
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
};

export default App;
