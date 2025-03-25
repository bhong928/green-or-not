"use client";
import { useState } from "react";

// Sample scoring function integrated in your component file.
function calculateSustainabilityScore(description, ecoLabels = []) {
  let score = 0;
  const keywords = [
    { keyword: "eco-friendly", points: 10 },
    { keyword: "sustainable", points: 10 },
    { keyword: "organic", points: 10 },
    { keyword: "biodegradable", points: 10 },
    { keyword: "recyclable", points: 10 },
    { keyword: "non-toxic", points: 10 },
    { keyword: "energy efficient", points: 10 },
    { keyword: "green", points: 10 },
  ];
  const lowerDescription = description.toLowerCase();
  keywords.forEach(item => {
    if (lowerDescription.includes(item.keyword)) {
      score += item.points;
    }
  });
  const ecoLabelWeights = {
    "USDA Organic": 20,
    "Fair Trade Certified": 20,
    "Energy Star": 15,
    "Cradle to Cradle": 15,
    "LEED Certified": 10,
    "B Corp": 10,
  };
  ecoLabels.forEach(label => {
    if (ecoLabelWeights[label]) {
      score += ecoLabelWeights[label];
    }
  });
  return Math.min(score, 100);
}

export default function Home() {
  const [productLink, setProductLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: productLink }),
      });
      const data = await response.json();

      if (response.ok) {
        // Example: Use static eco-labels for now (ideally, scrape or fetch real data)
        const ecoLabels = ["USDA Organic", "Fair Trade Certified"];
        const sustainabilityScore = calculateSustainabilityScore(data.productDescription, ecoLabels);

        setResult({
          productName: data.productName,
          productImage: data.productImage,
          productDescription: data.productDescription,
          sustainabilityScore,
          ecoLabels,
        });
      } else {
        setResult({
          productName: "Error fetching product details",
          productImage: "",
          productDescription: "",
          sustainabilityScore: 0,
          ecoLabels: [],
        });
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#3F4F44] h-screen">
      <div className="flex flex-col items-center justify-center p-10">
        <h1 className="font-extrabold text-7xl text-[#DCD7C9] mb-4">Green or Not</h1>
        <p className="mb-4 text-lg font-bold">Paste an Amazon product link below</p>
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

      {result && (
        <div className="bg-[#DCD7C9] text-black rounded-xl shadow-lg mt-6 p-6 w-full max-w-md max-h-[500px] overflow-y-auto">
          <h2 className="text-xl font-bold text-center mb-4">Results</h2>
          {result.productImage && (
            <img
              src={result.productImage}
              alt="Product"
              className="w-40 h-40 object-contain mx-auto mb-4 rounded"
            />
          )}
          <p><strong>Product Name:</strong> {result.productName}</p>
          {result.productDescription && (
            <p className="mt-2"><strong>Description:</strong> {result.productDescription}</p>
          )}
          <p><strong>Sustainability Score:</strong> {result.sustainabilityScore}/100</p>
          <p><strong>Eco-Labels:</strong> {result.ecoLabels.length > 0 ? result.ecoLabels.join(", ") : "None found"}</p>
        </div>
      )}
    </div>
  );
}