import { useState, useEffect } from "react";
import { useArea } from "../context/AreaContext";
import { fetchOthers, fetchRestaurants, fetchHousing } from "../lib/api";
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
  CardHeader,
  CardContent,
  CardTitle,
} from "../components/ui/card";
import {
  School,
  Hospital,
  Train,
  UtensilsCrossed,
  IndianRupee,
  Star,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { CustomTooltip } from "../components/charts/CustomTooltip";

export function LifestylePage() {
  const { selectedArea } = useArea();
  const [othersData, setOthersData] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null);
  const [housingData, setHousingData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedArea) return;
    setLoading(true);
    Promise.all([
      fetchOthers(selectedArea),
      fetchRestaurants(selectedArea),
      fetchHousing(selectedArea),
    ])
      .then(([others, restaurants, housing]) => {
        setOthersData(others);
        setRestaurantData(restaurants);
        setHousingData(housing);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedArea]);

  if (!selectedArea)
    return (
      <div className="text-center text-gray-400 py-12">
        Please select an area to view lifestyle insights.
      </div>
    );

  if (loading)
    return <div className="text-center text-gray-400 py-12">Loading...</div>;

  if (!othersData || !restaurantData || !housingData)
    return (
      <div className="text-center text-gray-400 py-12">
        No data available.
      </div>
    );

  const summary = othersData.summary || {};
  const amenities = othersData.amenities || [];
  const restaurants = restaurantData || {};
  const avgRating = restaurants.avg_rating || null;
  const avgPrice = restaurants.avg_price_for_two || null;
  const totalRestaurants = restaurants.count || 0;

  const schools = amenities.find((a) => a.category === "Schools");
  const hospitals = amenities.find((a) => a.category === "Hospitals");

  const avgPriceValue = housingData?.summary?.avg_price || 0;
  const avgDistanceToMetro = housingData?.summary?.avg_distance_to_metro || 0;

  const priceVsMetro = [{ x: avgDistanceToMetro, y: avgPriceValue }];
  const priceVsSchools = schools ? [{ x: schools.count, y: avgPriceValue }] : [];
  const priceVsHospitals = hospitals
    ? [{ x: hospitals.count, y: avgPriceValue }]
    : [];
  const ratingVsRestaurants =
    totalRestaurants && avgRating
      ? [{ x: totalRestaurants, y: avgRating }]
      : [];
  const ratingVsPriceForTwo =
    avgPrice && avgRating ? [{ x: avgPrice, y: avgRating }] : [];

  const ratingsHist = restaurants.ratings_hist || [];
  const priceHist = restaurants.price_for_two_hist || [];

  // 🔹 Common axis style
  const axisStyles = {
    tick: { fill: "#ffffff", fontSize: 12 },
    axisLine: { stroke: "#555" },
    tickLine: { stroke: "#555" },
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-14">
      {/* Hero Section */}
      <div className="mb-8 rounded-2xl overflow-hidden h-48 relative">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1080&q=80"
          alt="Lifestyle overview"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">
              Lifestyle & Connectivity
            </h1>
            <p className="text-lg">
              Amenities, accessibility, and dining insights for {selectedArea}
            </p>
          </div>
        </div>
      </div>

      {/* Dining Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
        <SummaryCard
          icon={<Star className="h-5 w-5 text-yellow-400" />}
          title="Average Rating"
          value={avgRating ? avgRating.toFixed(2) : "—"}
        />
        <SummaryCard
          icon={<IndianRupee className="h-5 w-5 text-green-400" />}
          title="Avg. Price for Two"
          value={avgPrice ? `₹${Math.round(avgPrice)}` : "—"}
        />
        <SummaryCard
          icon={<UtensilsCrossed className="h-5 w-5 text-orange-400" />}
          title="Total Restaurants"
          value={totalRestaurants || "—"}
        />
      </div>

      {/* Rating Histogram */}
      <ChartPanel title="Ratings Distribution">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ratingsHist}>
            <CartesianGrid stroke="#555" strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              {...axisStyles}
              dataKey="bin_center"
              label={{
                value: "Rating",
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
                position: "insideLeft",
                offset: 15,
                fill: "#fff",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#58A0C8" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartPanel>

      {/* Price for Two Histogram */}
      <ChartPanel title="Price for Two Distribution">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={priceHist}>
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
                position: "insideLeft",
                offset: 15,
                fill: "#fff",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#82ca9d" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartPanel>

      {/* Scatter Plots */}
      <ChartPanel title="Price vs Distance to Metro Station">
        <ScatterPlot
          data={priceVsMetro}
          xLabel="Distance (km)"
          yLabel="Price (₹)"
          color="#64B5F6"
        />
      </ChartPanel>

      <ChartPanel title="Price vs Schools in Locality">
        <ScatterPlot
          data={priceVsSchools}
          xLabel="Schools"
          yLabel="Price (₹)"
          color="#81C784"
        />
      </ChartPanel>

      <ChartPanel title="Price vs Hospitals in Locality">
        <ScatterPlot
          data={priceVsHospitals}
          xLabel="Hospitals"
          yLabel="Price (₹)"
          color="#E57373"
        />
      </ChartPanel>

      <ChartPanel title="Restaurant Rating vs Number of Restaurants">
        <ScatterPlot
          data={ratingVsRestaurants}
          xLabel="Number of Restaurants"
          yLabel="Average Rating"
          color="#FFD54F"
        />
      </ChartPanel>

      <ChartPanel title="Rating vs Price for Two">
        <ScatterPlot
          data={ratingVsPriceForTwo}
          xLabel="Price for Two (₹)"
          yLabel="Rating"
          color="#BA68C8"
        />
      </ChartPanel>
    </div>
  );
}

/* ---------------- Helper Components ---------------- */

function SummaryCard({ icon, title, value }) {
  return (
    <Card className="glass-panel hover-lift text-white">
      <CardHeader className="flex items-center space-x-2">
        {icon}
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
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

function ScatterPlot({ data, xLabel, yLabel, color }) {
  const axisStyles = {
    tick: { fill: "#ffffff", fontSize: 12 },
    axisLine: { stroke: "#555" },
    tickLine: { stroke: "#555" },
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart>
        <CartesianGrid stroke="#555" strokeDasharray="3 3" opacity={0.3} />
        <XAxis
          {...axisStyles}
          dataKey="x"
          label={{
            value: xLabel,
            position: "insideBottom",
            offset: -5,
            fill: "#fff",
          }}
        />
        <YAxis
          {...axisStyles}
          dataKey="y"
          label={{
            value: yLabel,
            angle: -90,
            position: "insideLeft",
            offset: 15,
            fill: "#fff",
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Scatter data={data} fill={color} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
