"use client";
import { useState } from "react";


export default function Home() {
  const [productLink, setProductLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // show loading state
    setResult(null);

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: productLink }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult({
          productName: data.productName,
          productImage: data.productImage,
          productDescription: data.productDescription,
          sustainabilityScore: Math.floor(Math.random() * 100), // PLACEHOLDER SCORE
          ecoLabels: ["USDA Organic", "Fair Trade Certified"], // PLACEHOLDER LABELS
        });
      } else {
        setResult({ productName: "Error fetching product details" });
      }
    }
    catch (error) {
      console.error("Fetch Error:", error);
    }

    setIsLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center bg-[#3F4F44] h-screen">
      <div className="flex flex-col items-center justify-center p-10">
        <h1 className="font-extrabold text-7xl text-[#DCD7C9] mb-4">Green or Not</h1>
        <p className="mb-4 text-lg font-bold">Paste a product the product link below</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-md gap-4">
        <input 
          className="text-center font-semibold w-full border-1 rounded-2xl bg-[#DCD7C9] focus:outline-none focus:ring-1 p-2"
          type="url"
          placeholder="Enter url"
          value={productLink}
          onChange={(e) => setProductLink(e.target.value)}
        />
        <button
        type="submit"
        className="bg-[#DCD7C9] border-1 rounded-2xl font-semibold hover:bg-[#A27B5C] transition px-6 py-1"
        >
        {isLoading ? "Analyzing..." : "Analyze Product"}
        </button>
      </form>

      {/* Display Analysis Results */}
      {result && (
        <div className="bg-[#DCD7C9] text-black rounded-xl shadow-lg mt-6 p-6"> 
          <h2 className="text-xl font-bold text-center">Results</h2>
          <p><strong>Product Name:</strong> {result.productName}</p>
          <p><strong>Sustainability Score:</strong> {result.sustainabilityScore}/100</p>
          <p><strong>Eco-Labels:</strong> {result.ecoLabels.join(", ")}</p>
        </div>
      )}
    </div>
  );
}
