export async function fetchRestaurantsAI(query: string) {
  const res = await fetch("http://localhost:8000/ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return await res.json();
}
