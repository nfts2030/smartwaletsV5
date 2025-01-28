"use client";

import { useState } from "react";

export default function Hero() {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [inputBackgroundColor, setInputBackgroundColor] = useState("");
  const [inputBorderColor, setInputBorderColor] = useState("border-green-300");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubscribe = async () => {
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      setInputBorderColor("border-red-500");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:3002/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Wallet created:", data);
        setSuccessMessage("Email registration successful. Please use Sign in to enter.");
        setInputBackgroundColor("bg-green-900");
        setInputBorderColor("border-green-300");
      } else {
        const errorData = await response.json();
        console.error("Failed to create wallet:", errorData.error);
        setErrorMessage(`Subscription failed: ${errorData.error}`);
        setInputBorderColor("border-red-500");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again.");
      setInputBorderColor("border-red-500");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <img
            src="https://static.wixstatic.com/media/5b6a5f_09d324789fd846e3ac1fdec638c79289~mv2.png/v1/crop/x_0,y_619,w_1500,h_262/fill/w_386,h_67,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Horizontal%20Logo-TC-Fah_edited.png"
            alt="TulumCoin Logo"
            className="mx-auto  "
          />
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Rewards</span>
            <span className="block text-indigo-600">Smart Wallet</span>
          </h1>
          <div className="mt-3 max-w-md mx-auto text-base text-green-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Register your account and enjoy your new digital Smart Wallet.
          </div>
        </div>
        <div className="flex justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessage("");
              setInputBorderColor("border-green-300");
            }}
            className={`p-2 border ${inputBorderColor} rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black font-bold ${inputBackgroundColor}`}
            aria-label="Enter your email"
          />
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </div>
        {errorMessage && (
          <div className="text-center mt-4 text-red-500" aria-live="polite">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="text-center mt-4 text-green-600" aria-live="polite">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}