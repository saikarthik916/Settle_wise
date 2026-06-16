import { useState, useEffect } from "react";
import { useArea } from "../context/AreaContext";
import { fetchHousing } from "../lib/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
} from "recharts";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { CustomTooltip } from "../components/charts/CustomTooltip";

export function PriceAnalysisPage({ initialArea }) {
  const { selectedArea } = useArea();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialArea) {
      console.log("📍 Loading Price Analysis for:", initialArea);
    }
  }, [initialArea]);

  useEffect(() => {
    if (!selectedArea) return;
    setLoading(true);
    setError(null);

    fetchHousing(selectedArea?.name || selectedArea)
      .then((res) => {
        setData(res);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedArea]);

  if (!selectedArea)
    return (
      <div className="text-center text-gray-400 py-12">
        Please select an area to view data.
      </div>
    );

  if (loading)
    return <div className="text-center text-gray-400 py-12">Loading data...</div>;

  if (error)
    return (
      <div className="text-center text-red-400 py-12">
        Failed to fetch data: {error}
      </div>
    );

  if (!data)
    return <div className="text-center text-gray-400 py-12">No data available.</div>;

  const {
    summary,
    histogram,
    price_vs_area,
    price_vs_bedrooms,
    price_vs_bathrooms,
    price_vs_furnishing,
    price_vs_building_age,
    regression,
  } = data;

  const regAge = regression?.price_vs_building_age;

  const regressionLine = (dataset, reg) => {
    if (!dataset?.length || !reg) return [];
    const xMin = Math.min(...dataset.map((d) => d.x));
    const xMax = Math.max(...dataset.map((d) => d.x));
    return [
      { x: xMin, y: reg.slope * xMin + reg.intercept },
      { x: xMax, y: reg.slope * xMax + reg.intercept },
    ];
  };

  // 🔹 Common axis styles for all charts
  const axisStyles = {
    tick: { fill: "#ffffff", fontSize: 12 },
    axisLine: { stroke: "#555" },
    tickLine: { stroke: "#555" },
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Hero */}
      <div className="mb-8 rounded-2xl overflow-hidden h-48 relative">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1747555094127-9a922d56a64c"
          alt="Modern residential buildings"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">Price Analysis</h1>
            <p className="text-lg">
              Explore property pricing insights for {summary.address}
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="glass-panel p-6 text-white space-y-2">
        <h2 className="text-2xl font-semibold mb-2">{summary.address}</h2>
        <p>
          <strong>Average Price:</strong> ₹
          {Math.round(summary.avg_price).toLocaleString()}
        </p>
        <p>
          <strong>Average AQI:</strong>{" "}
          {summary.avg_aqi ? Math.round(summary.avg_aqi) : "No data"}
        </p>
      </div>

      {/* Chart 1: Price Distribution */}
      {histogram?.length > 0 && (
        <ChartCard title="Price vs Availability (Histogram)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={histogram}>
              <CartesianGrid stroke="#555" strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                {...axisStyles}
                dataKey="bin_center"
                label={{
                  value: "Price (₹)",
                  position: "insideBottom",
                  offset: -5,
                  fill: "#fff",
                }}
              />
              <YAxis
                {...axisStyles}
                label={{
                  value: "Count",
                  angle: -90,
                  position: "outsideLeft",
                  offset: -5,
                  fill: "#fff",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#58A0C8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Chart 2: Price vs Area */}
      <ChartCard title="Price vs Area (sq. ft)">
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid stroke="#555" strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              {...axisStyles}
              dataKey="x"
              name="Area (sq.ft)"
              label={{
                value: "Area (sq.ft)",
                position: "insideBottom",
                offset: -5,
                fill: "#fff",
              }}
            />
            <YAxis
              {...axisStyles}
              dataKey="y"
              name="Price (₹)"
              label={{
                value: "Price (₹)",
                angle: -90,
                position: "outsideLeft",
                offset: -5,
                fill: "#fff",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={price_vs_area} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Chart 3: Price vs Bedrooms */}
      <ChartCard title="Price vs Number of Bedrooms">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={price_vs_bedrooms}>
            <CartesianGrid stroke="#555" strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              {...axisStyles}
              dataKey="x"
              label={{
                value: "Bedrooms",
                position: "insideBottom",
                offset: -5,
                fill: "#fff",
              }}
            />
            <YAxis
              {...axisStyles}
              label={{
                value: "Avg Price (₹)",
                angle: -90,
                position: "outsideLeft",
                offset: -5,
                fill: "#fff",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="y" fill="#7ACFB0" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Chart 4: Price vs Bathrooms */}
      <ChartCard title="Price vs Number of Bathrooms">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={price_vs_bathrooms}>
            <CartesianGrid stroke="#555" strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              {...axisStyles}
              dataKey="x"
              label={{
                value: "Bathrooms",
                position: "insideBottom",
                offset: -5,
                fill: "#fff",
              }}
            />
            <YAxis
              {...axisStyles}
              label={{
                value: "Avg Price (₹)",
                angle: -90,
                position: "outsideLeft",
                offset: -5,
                fill: "#fff",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="y" fill="#F7B267" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Chart 5: Average Price vs Furnishing */}
      <ChartCard title="Average Price vs Furnishing Status">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={price_vs_furnishing}>
            <CartesianGrid stroke="#555" strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              {...axisStyles}
              dataKey="x"
              label={{
                value: "Furnishing Type",
                position: "insideBottom",
                offset: -5,
                fill: "#fff",
              }}
            />
            <YAxis
              {...axisStyles}
              label={{
                value: "Avg Price (₹)",
                angle: -90,
                position: "outsideLeft",
                offset: -5,
                fill: "#fff",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="y" fill="#E66B6B" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Chart 6: Price vs Building Age */}
      <ChartCard title="Price vs Building Age">
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid stroke="#555" strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              {...axisStyles}
              dataKey="x"
              name="Building Age (Years)"
              label={{
                value: "Building Age (Years)",
                position: "insideBottom",
                offset: -5,
                fill: "#fff",
              }}
            />
            <YAxis
              {...axisStyles}
              dataKey="y"
              name="Price (₹)"
              label={{
                value: "Price (₹)",
                angle: -90,
                position: "outsideLeft",
                offset: -5,
                fill: "#fff",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={price_vs_building_age} fill="#B37FEB" />
            {regAge && (
              <Line
                data={regressionLine(price_vs_building_age, regAge)}
                dataKey="y"
                stroke="#B37FEB"
                dot={false}
              />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

// 🔹 Reusable chart wrapper
function ChartCard({ title, children }) {
  return (
    <div className="glass-panel p-6">
      <h3 className="font-semibold mb-4 text-white">{title}</h3>
      {children}
    </div>
  );
}
