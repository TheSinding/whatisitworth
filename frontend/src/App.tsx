import React, { useDebugValue, useEffect, useState } from "react";
import { Estimation, queryValue } from "./api";
import "./App.css";
import useDebounce from "./useDebounce";

function App() {
  const [searchTerm, setsearchTerm] = useState<string>("");
  const [estimation, setEstimation] = useState<Estimation | null>(null);
  const [searching, setSearching] = useState(false);
  const debounedSearchTerm = useDebounce(searchTerm);

  useEffect(() => {
    async function search() {
      try {
        setSearching(true);
        const estimation = await queryValue(debounedSearchTerm);
        console.log(estimation);

        setEstimation(estimation);
      } catch (error) {
      } finally {
        setSearching(false);
      }
    }
    if (debounedSearchTerm) {
      search();
    } else {
      setEstimation(null);
    }
    return () => {
      setEstimation(null);
    };
  }, [debounedSearchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setsearchTerm(value);
  };
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="relative sm:py-16">
        <div aria-hidden="true" className="hidden sm:block">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gray-50 rounded-r-3xl"></div>
          <svg
            className="absolute top-8 left-1/2 -ml-3"
            width="404"
            height="392"
            fill="none"
            viewBox="0 0 404 392"
          >
            <defs>
              <pattern
                id="8228f071-bcee-4ec8-905a-2a059a2cc4fb"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x="0"
                  y="0"
                  width="4"
                  height="4"
                  className="text-gray-200"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width="404"
              height="392"
              fill="url(#8228f071-bcee-4ec8-905a-2a059a2cc4fb)"
            />
          </svg>
        </div>
        <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="relative rounded-2xl px-6 py-10 bg-indigo-600 overflow-hidden shadow-xl sm:px-12 sm:py-20">
            <div
              aria-hidden="true"
              className="absolute inset-0 -mt-72 sm:-mt-32 md:mt-0"
            >
              <svg
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 1463 360"
              >
                <path
                  className="text-indigo-500 text-opacity-40"
                  fill="currentColor"
                  d="M-82.673 72l1761.849 472.086-134.327 501.315-1761.85-472.086z"
                />
                <path
                  className="text-indigo-700 text-opacity-40"
                  fill="currentColor"
                  d="M-217.088 544.086L1544.761 72l134.327 501.316-1761.849 472.086z"
                />
              </svg>
            </div>
            <div className="relative">
              <div className="sm:text-center">
                <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                  {!estimation && !searching && (
                    <span>
                      Get an estimation of your used product value <br></br>and
                      find the best place to list it.
                    </span>
                  )}
                  {searching && (
                    <span>
                      <i className="fa-thin fa-spinner-third fa-spin mr-3"></i>
                      Searching, please wait
                    </span>
                  )}
                  {estimation && (
                    <span>Estimation for {debounedSearchTerm}</span>
                  )}
                </h2>
                {!estimation && (
                  <p className="mt-6 mx-auto max-w-2xl text-lg text-indigo-200">
                    Search through milions of used markeds and find the best one
                    for your product.
                  </p>
                )}
                {estimation && (
                  <div className="grid grid-cols-2 font-extrabold text-white tracking-tight sm:text-2xl w-80">
                    <span className="text-gray-200 text-left">Mean:</span>
                    <span className="text-right">{estimation.mean}</span>

                    <span className="text-gray-200 text-left">Min:</span>
                    <span className="text-right">{estimation.min}</span>

                    <span className="text-gray-200 text-left">Max:</span>
                    <span className="text-right">{estimation.max}</span>

                    <span className="text-gray-200 text-left">Estimation:</span>
                    <span className="text-right">{estimation.estimation}</span>
                  </div>
                )}
              </div>
              <form action="#" className="mt-12 sm:mx-auto sm:max-w-lg sm:flex">
                <div className="min-w-0 flex-1">
                  <label htmlFor="cta-search" className="sr-only">
                    Search for a product
                  </label>
                  <input
                    id="cta-search"
                    className="block w-full border border-transparent rounded-md px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                    placeholder="Search for a product"
                    onChange={handleSearch}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
