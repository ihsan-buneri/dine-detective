import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import RestaurantCard from "@/components/RestaurantCard";
import { fetchRestaurantsAI } from "@/lib/api";

export default function Home() {
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (query: string) => {
    const data = await fetchRestaurantsAI(query);
    setResults(data);
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Find Your Favorite Restaurants</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {results.map((r, i) => (
          <RestaurantCard key={i} restaurant={r} />
        ))}
      </div>
    </main>
  );
}
