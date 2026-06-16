import { useEffect, useState } from "react";
import { useArea } from "../context/AreaContext";
import { fetchHousing, fetchOthers } from "../lib/api";
import {
  ResponsiveContainer,
  CartesianGrid,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Shield, AlertTriangle, Footprints, Wind } from "lucide-react";
import { CustomTooltip } from "../components/charts/CustomTooltip";

export function CrimeSafetyPage() {
  const { selectedArea } = useArea();
  const [othersData, setOthersData] = useState(null);
  const [housingData, setHousingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedArea) return;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchOthers(selectedArea?.name || selectedArea),
      fetchHousing(selectedArea?.name || selectedArea),
    ])
      .then(([others, housing]) => {
        setOthersData(others);
        setHousingData(housing);
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
    return <div className="text-center text-gray-400 py-12">Loading...</div>;

  if (error)
    return (
      <div className="text-center text-red-400 py-12">
        Failed to fetch data: {error}
      </div>
    );

  if (!othersData || !housingData)
    return (
      <div className="text-center text-gray-400 py-12">
        No data available.
      </div>
    );

  const summary = othersData.summary || {};
  const amenities = othersData.amenities || [];

  const price = housingData.summary?.avg_price || 0;

  const priceVsCrimes = [{ x: summary.total_crimes, y: price }];
  const priceVsAqi = [{ x: summary.avg_aqi, y: price }];

  const firestations = amenities.find((a) => a.category === "Firestations");
  const priceVsFire = firestations ? [{ x: firestations.count, y: price }] : [];

  // 🔹 Common axis styles (same as PriceAnalysisPage)
  const axisStyles = {
    tick: { fill: "#ffffff", fontSize: 12 },
    axisLine: { stroke: "#555" },
    tickLine: { stroke: "#555" },
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="text-center text-white">
        <h1 className="text-3xl font-bold mb-2">Crime & Safety Analysis</h1>
        <p className="text-muted-foreground">
          Explore how safety and environmental factors influence property values in{" "}
          {summary.address}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
          title="Total Crimes"
          value={summary.total_crimes ?? "N/A"}
          subtitle="Reported cases"
        />
        <SummaryCard
          icon={<Wind className="h-5 w-5 text-primary" />}
          title="Average AQI"
          value={summary.avg_aqi ?? "N/A"}
          subtitle="Air quality index"
        />
        <SummaryCard
          icon={<Footprints className="h-5 w-5 text-warning" />}
          title="Walkability Score"
          value={summary.walkability_score ?? "N/A"}
          subtitle="Pedestrian access"
        />
        <SummaryCard
          icon={<Shield className="h-5 w-5 text-success" />}
          title="Firestations"
          value={firestations ? firestations.count : "N/A"}
          subtitle="Nearby stations"
        />
      </div>

      {/* Amenities Overview */}
      {amenities.length > 0 && (
        <ChartPanel title="Amenities Overview">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={amenities}>
              <CartesianGrid stroke="#555" strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                {...axisStyles}
                dataKey="category"
                label={{
                  value: "Amenity Type",
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
                  position: "insideLeft", // ✅ Inward placement
                  offset: 15, // ✅ Controlled inward spacing
                  fill: "#fff",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#82ca9d" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      )}

      {/* Chart 1: Price vs Crimes */}
      <ChartPanel title="Price vs Crimes in Locality">
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid stroke="#555" strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              {...axisStyles}
              dataKey="x"
              name="Total Crimes"
              label={{
                value: "Total Crimes",
                position: "insideBottom",
                offset: -5,
                fill: "#fff",
              }}
            />
            <YAxis
              {...axisStyles}
              dataKey="y"
              name="Avg Price (₹)"
              label={{
                value: "Avg Price (₹)",
                angle: -90,
                position: "insideLeft",
                offset: 15, // ✅ Slightly inward
                fill: "#fff",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Scatter data={priceVsCrimes} fill="#FF6B6B" />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartPanel>

      {/* Chart 2: Price vs Average AQI */}
      <ChartPanel title="Price vs Average AQI">
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid stroke="#555" strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              {...axisStyles}
              dataKey="x"
              name="AQI"
              label={{
                value: "Average AQI",
                position: "insideBottom",
                offset: -5,
                fill: "#fff",
              }}
            />
            <YAxis
              {...axisStyles}
              dataKey="y"
              name="Avg Price (₹)"
              label={{
                value: "Avg Price (₹)",
                angle: -90,
                position: "insideLeft",
                offset: 15,
                fill: "#fff",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Scatter data={priceVsAqi} fill="#4FC3F7" />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartPanel>

      {/* Chart 3: Price vs Firestations */}
      <ChartPanel title="Price vs Firestations in Locality">
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid stroke="#555" strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              {...axisStyles}
              dataKey="x"
              name="Firestations"
              label={{
                value: "Firestations Count",
                position: "insideBottom",
                offset: -5,
                fill: "#fff",
              }}
            />
            <YAxis
              {...axisStyles}
              dataKey="y"
              name="Avg Price (₹)"
              label={{
                value: "Avg Price (₹)",
                angle: -90,
                position: "insideLeft",
                offset: 15,
                fill: "#fff",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Scatter data={priceVsFire} fill="#FFD54F" />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartPanel>
    </div>
  );
}

/* ---------------- Helper Components ---------------- */

function SummaryCard({ icon, title, value, subtitle }) {
  return (
    <Card className="glass-panel hover-lift text-white">
      <CardHeader className="flex items-center space-x-2">
        {icon}
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function ChartPanel({ title, children }) {
  return (
    <div className="glass-panel p-6">
      <h3 className="font-semibold mb-4 text-white">{title}</h3>
      {children}
    </div>
  );
}
