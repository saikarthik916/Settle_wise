// src/components/charts/CustomTooltip.jsx

export function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className="backdrop-blur-2xl bg-white/30 border border-white/30 rounded-xl shadow-lg px-4 py-2 transition-all duration-200 ease-in-out hover:scale-[1.03]"
      style={{
        color: "white",
        fontSize: "0.85rem",
        lineHeight: "1.25rem",
        transition: "all 0.2s ease-in-out",
      }}
    >
      {label && <p className="font-semibold mb-1">{label}</p>}
      {payload.map((entry, index) => (
        <p key={`item-${index}`} className="capitalize">
          {entry.name}: <span className="font-medium">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}
