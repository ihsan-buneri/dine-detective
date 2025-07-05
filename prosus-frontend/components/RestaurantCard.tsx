export default function RestaurantCard({ restaurant }: { restaurant: any }) {
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-xl font-bold">{restaurant.name}</h2>
      <p>{restaurant.description || "No description available"}</p>
      <button className="mt-2 bg-green-600 text-white px-4 py-1 rounded">
        View Menu
      </button>
    </div>
  );
}
