const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// 🔹 Keep the new endpoint name but export both for compatibility
export async function fetchAreas() {
  const res = await fetch(`${BASE_URL}/areas`);
  if (!res.ok) throw new Error("Failed to fetch areas");
  return res.json();
}

// ✅ Alias old name to new function (backward compatibility)
export const fetchLocalities = fetchAreas;

export async function fetchHousing(area) {
  const res = await fetch(
    `${BASE_URL}/data/housing?address=${encodeURIComponent(area)}`
  );
  if (!res.ok) throw new Error("Failed to fetch housing data");
  return res.json();
}

export async function fetchOthers(area) {
  const res = await fetch(
    `${BASE_URL}/data/others?address=${encodeURIComponent(area)}`
  );
  if (!res.ok) throw new Error("Failed to fetch others data");
  return res.json();
}

export async function fetchRestaurants(area) {
  const res = await fetch(
    `${BASE_URL}/data/restaurants?address=${encodeURIComponent(area)}`
  );
  if (!res.ok) throw new Error("Failed to fetch restaurants data");
  return res.json();
}

export async function fetchCityAverages() {
  // Uses /areas instead of /localities internally
  const localities = await fetchAreas();
  const allAreas = localities.map((a) => a.address);

  let totalPrice = 0,
    totalAqi = 0,
    totalCrime = 0,
    totalTransit = 0,
    count = 0;

  for (const area of allAreas) {
    try {
      const [housing, others] = await Promise.all([
        fetchHousing(area),
        fetchOthers(area),
      ]);
      totalPrice += housing.summary?.avg_price || 0;
      totalAqi += housing.summary?.avg_aqi || others.summary?.avg_aqi || 0;
      totalCrime +=
        others.summary?.total_crimes || others.summary?.avg_crime_index || 0;
      totalTransit +=
        others.summary?.walkability_score || others.summary?.safety_index || 0;
      count++;
    } catch (err) {
      console.warn("Skipping area:", area, err);
    }
  }

  if (count === 0) throw new Error("No data for city averages");

  return {
    medianPrice: Math.round(totalPrice / count),
    aqi: Math.round(totalAqi / count),
    crimeIndex: Math.round(totalCrime / count),
    transitScore: Math.round(totalTransit / count),
    count,
  };
}
