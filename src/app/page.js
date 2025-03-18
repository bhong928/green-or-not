"use client";
import { useState } from "react";


export default function Home() {
  const [productLink, setProductLink] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product link submitted:", productLink)
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
        Analyze Product
        </button>
      </form>
    </div>
  );
}
