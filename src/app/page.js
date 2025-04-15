"use client";
import { useState } from "react";

// Helper function to select a tree image based on sustainability score
function getTreeImage(score) {
  if (score <= 25) {
    return "/deadtree.png";      // Lowest score
  } else if (score <= 50) {
    return "/snow_tree.png";      // Second lowest
  } else if (score <= 75) {
    return "/falltree.png";       // Second best
  } else {
    return "/green_tree.png";     // Best score
  }
}

function calculateSustainabilityScore(productName, description, ecoLabels = []) {
  let totalScore = 0;
  let breakdown = {
    keywords: [],
    ecoLabels: [],
  };

  // Define eco-friendly keywords with base points
  const keywords = [
    { keyword: "eco-friendly", points: 10 },
    { keyword: "eco friendly", points: 10 },
    { keyword: "sustainable", points: 10 },
    { keyword: "organic", points: 10 },
    { keyword: "biodegradable", points: 10 },
    { keyword: "recyclable", points: 10 },
    { keyword: "non-toxic", points: 10 },
    { keyword: "energy efficient", points: 10 },
    { keyword: "green", points: 10 },
    { keyword: "bamboo", points: 5 },
    { keyword: "vegan", points: 5 },
    { keyword: "natural", points: 5 },
    { keyword: "wooden", points: 5 },
    { keyword: "renewable", points: 10 },
    { keyword: "compostable", points: 10 },
    { keyword: "carbon neutral", points: 10 },
    { keyword: "plant-based", points: 10 },
    { keyword: "cruelty-free", points: 10 },
    { keyword: "zero waste", points: 10 },
    { keyword: "sustainably sourced", points: 10 },
    { keyword: "eco conscious", points: 10 },
    { keyword: "environmentally friendly", points: 10 },
    { keyword: "low carbon", points: 10 },
    { keyword: "waste reduction", points: 10 },
    { keyword: "recycled", points: 10 },
    { keyword: "upcycled", points: 10 },
    { keyword: "eco packaging", points: 10 },
    { keyword: "non-plastic", points: 10 },
    { keyword: "reusable", points: 5 },
    { keyword: "responsibly sourced", points: 10 },
    { keyword: "organic cotton", points: 10 },
    { keyword: "gmo-free", points: 10 },
    { keyword: "clean energy", points: 10 },
    { keyword: "energy saving", points: 10 },
  ];

  // Combine product name and description for keyword scanning
  const combinedText = (productName + " " + description).toLowerCase();
  
  keywords.forEach(item => {
    if (combinedText.includes(item.keyword)) {
      totalScore += item.points;
      breakdown.keywords.push({ keyword: item.keyword, points: item.points });
    }
  });

  // Weight for eco-certifications
  const ecoLabelWeights = {
    "USDA Organic": 20,
    "Fair Trade Certified": 20,
    "Energy Star": 15,
    "Cradle to Cradle": 15,
    "LEED Certified": 10,
    "B Corp": 10,
    "FSC Certified": 15,
    "Blue Angel": 10,
    "EcoLogo": 10,
    "GreenGuard Certified": 10,
    "Non-GMO Project Verified": 10,
  };

  ecoLabels.forEach(label => {
    if (ecoLabelWeights[label]) {
      totalScore += ecoLabelWeights[label];
      breakdown.ecoLabels.push({ label, points: ecoLabelWeights[label] });
    }
  });

  // Normalize so the final score doesn't exceed 100
  const finalScore = Math.min(totalScore, 100);
  return { finalScore, breakdown };
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
        const ecoLabels = data.ecoLabels || [];
        const scoreData = calculateSustainabilityScore(
          data.productName,       // Pass productName
          data.productDescription, // Pass productDescription
          ecoLabels
        );
        setResult({
          productName: data.productName,
          productImage: data.productImage,
          productDescription: data.productDescription,
          sustainabilityScore: scoreData.finalScore,
          ecoLabels,
          scoreBreakdown: scoreData.breakdown,
        });
      } else {
        setResult({
          productName: "Error fetching product details",
          productImage: "",
          productDescription: "",
          sustainabilityScore: 0,
          ecoLabels: [],
          scoreBreakdown: { keywords: [], ecoLabels: [] },
        });
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setResult({
        productName: "Error fetching product details",
        productImage: "",
        productDescription: "",
        sustainabilityScore: 0,
        ecoLabels: [],
        scoreBreakdown: { keywords: [], ecoLabels: [] },
      });
    }
    setIsLoading(false);
  };

  const handleClear = () => {
    setProductLink("");
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#3F4F44]">
      <div className="flex flex-col items-center justify-center p-10">
        <h1 className="font-extrabold text-7xl text-[#DCD7C9] mb-4">Green or Not</h1>
        <p className="mb-4 text-lg font-bold text-[#DCD7C9]">
          Paste an Amazon product link below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-md gap-4">
        <input 
          className="text-center font-semibold w-full border-1 rounded-2xl bg-[#DCD7C9] focus:outline-none focus:ring-1 p-2"
          type="url"
          placeholder="Enter url"
          value={productLink}
          onChange={(e) => setProductLink(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-[#DCD7C9] border-1 rounded-2xl font-semibold hover:bg-[#A27B5C] transition px-6 py-1"
          >
            {isLoading ? "Analyzing..." : "Analyze Product"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-[#DCD7C9] border-1 rounded-2xl font-semibold hover:bg-[#A27B5C] transition px-6 py-1"
          >
            Clear
          </button>
        </div>
      </form>

      {result && (
        <>
          <div className="my-4 flex flex-col items-center">
            <img
              src={getTreeImage(result.sustainabilityScore)}
              alt="Sustainability Tree"
              className="w-100 h-100 object-contain rounded"
            />
          </div>
          <div className="bg-[#DCD7C9] text-black rounded-xl shadow-lg mt-6 p-6 w-full max-w-md">
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
            <div className="mt-4">
              <h3 className="font-bold">Score Breakdown:</h3>
              {result.scoreBreakdown?.keywords?.length > 0 && (
                <div>
                  <p className="underline">Keywords:</p>
                  <ul>
                    {result.scoreBreakdown.keywords.map((item, index) => (
                      <li key={`kw-${index}`}>&quot;{item.keyword}&quot; adds {item.points} points</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.scoreBreakdown?.ecoLabels?.length > 0 && (
                <div>
                  <p className="underline">Eco-Labels:</p>
                  <ul>
                    {result.scoreBreakdown.ecoLabels.map((item, index) => (
                      <li key={`el-${index}`}>{item.label} adds {item.points} points</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <p>
              <strong>Eco-Labels Detected:</strong>{" "}
              {result.ecoLabels.length > 0 ? result.ecoLabels.join(", ") : "None found"}
            </p>
          </div>
        </>
      )}
    </div>
  );
}