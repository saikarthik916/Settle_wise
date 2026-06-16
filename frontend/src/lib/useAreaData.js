// example client-side fetch hook (vanilla)
export async function fetchHousing(area) {
  const encoded = encodeURIComponent(area);
  const res = await fetch(`/api/data/housing?address=${encoded}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
