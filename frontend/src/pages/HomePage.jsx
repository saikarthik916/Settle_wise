import { useEffect, useState } from "react";
import { AreaSelector } from "../components/AreaSelector";
import { StatCard } from "../components/StatCard";
import { Button } from "../components/ui/button";
import {
  IndianRupee,
  Wind,
  Shield,
  Train,
  ArrowRight,
  TrendingUp,
  UtensilsCrossed,
  Home as HomeIcon,
} from "lucide-react";
import {
  fetchAreas,
  fetchHousing,
  fetchOthers,
  fetchCityAverages,
} from "../lib/api";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function HomePage({ onNavigate }) {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingAreas, setFetchingAreas] = useState(true);

  // City averages (from backend)
  const [cityAverages, setCityAverages] = useState(null);
  const [loadingCityAvg, setLoadingCityAvg] = useState(true);

  // Fetch all areas for dropdown
  useEffect(() => {
    fetchAreas()
      .then((data) => {
        const formatted = data.map((a, index) => ({
          id: index,
          name: a.address,
        }));
        setAreas(formatted);
      })
      .catch((err) => console.error("Failed to load areas:", err))
      .finally(() => setFetchingAreas(false));
  }, []);

  // Fetch city-wide averages
  useEffect(() => {
    fetchCityAverages()
      .then((data) => setCityAverages(data))
      .catch((err) => console.error("Failed to load city averages:", err))
      .finally(() => setLoadingCityAvg(false));
  }, []);

  // Fetch selected area summary
  useEffect(() => {
    if (!selectedArea) return;

    setLoading(true);
    Promise.all([fetchHousing(selectedArea.name), fetchOthers(selectedArea.name)])
      .then(([housingData, othersData]) => {
        const avgPrice = Math.round(housingData.summary?.avg_price || 0);
        const avgAQI = Math.round(
          housingData.summary?.avg_aqi ||
            othersData.summary?.avg_aqi ||
            0
        );
        const crimeIndex =
          othersData.summary?.total_crimes ||
          othersData.summary?.avg_crime_index ||
          0;
        const walkability =
          othersData.summary?.walkability_score ||
          othersData.summary?.safety_index ||
          0;

        setSummary({
          name: selectedArea.name,
          medianPrice: avgPrice,
          aqi: avgAQI,
          crimeIndex: crimeIndex,
          transitScore: walkability,
        });
      })
      .catch((err) => console.error("Failed to load area summary:", err))
      .finally(() => setLoading(false));
  }, [selectedArea]);

 const handleExplore = () => {
  if (!selectedArea?.name) {
    console.warn("⚠️ Please select an area before exploring");
    return;
  }

  console.log("🟢 Navigating to price page for:", selectedArea.name);
  onNavigate("price", selectedArea.name); // ✅ pass area name to App.jsx
};




  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1695667424131-a9680e0307ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Delhi skyline"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Make Informed Decisions About{" "}
                <span className="text-primary">Your Next Home Purchase</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Compare neighborhoods across Delhi NCR with data-driven insights
                on pricing, safety, transit, and lifestyle.
              </p>
            </div>

            {/* Area Selector */}
            <div className="max-w-xl mx-auto space-y-4">
              <div className="text-sm text-muted-foreground">
                Select an area to explore:
              </div>

              {fetchingAreas ? (
                <div className="text-gray-400">Loading areas...</div>
              ) : (
                <AreaSelector
                  areas={areas}
                  value={selectedArea?.id ?? ""}
                  onChange={(id) => {
                    const area = areas.find((a) => a.id === id);
                    setSelectedArea(area || null);
                    setSummary(null);
                  }}
                  placeholder="Select an area to explore"
                />
              )}

             
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-16 -mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-gray-400 py-6">
              Fetching area data...
            </div>
          ) : selectedArea && summary ? (
            // Selected Area Stats
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2 text-white">
                  {summary.name} Overview
                </h2>
                <p className="text-white/70">Quick stats for this locality</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Median Price"
                  value={`₹${summary.medianPrice.toLocaleString()}`}
                  icon={IndianRupee}
                  subtitle="Average property price"
                  tooltip="Median housing price from backend data"
                  glass
                />
                <StatCard
                  title="Air Quality Index"
                  value={summary.aqi}
                  icon={Wind}
                  subtitle={
                    summary.aqi > 200
                      ? "Poor"
                      : summary.aqi > 150
                      ? "Moderate"
                      : "Good"
                  }
                  tooltip="Average AQI from backend data"
                  status={
                    summary.aqi > 200
                      ? "poor"
                      : summary.aqi > 150
                      ? "moderate"
                      : "good"
                  }
                  glass
                />
                <StatCard
                  title="Safety Index"
                  value={`${summary.crimeIndex}`}
                  icon={Shield}
                  subtitle={
                    summary.crimeIndex < 300
                      ? "Safe"
                      : summary.crimeIndex < 600
                      ? "Moderate"
                      : "Needs Caution"
                  }
                  tooltip="Total crimes from backend data"
                  status={
                    summary.crimeIndex < 300
                      ? "good"
                      : summary.crimeIndex < 600
                      ? "moderate"
                      : "poor"
                  }
                  glass
                />
                <StatCard
                  title="Walkability / Transit"
                  value={`${summary.transitScore}`}
                  icon={Train}
                  subtitle="Connectivity & amenities"
                  tooltip="Walkability score from backend data"
                  status={
                    summary.transitScore > 80
                      ? "good"
                      : summary.transitScore > 60
                      ? "moderate"
                      : "poor"
                  }
                  glass
                />
              </div>
            </div>
          ) : (
            // Delhi NCR Averages (fallback)
            <div className="space-y-6">
              <div className="text-center glass-panel p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-2 text-white">
                  Delhi NCR Averages
                </h2>
                <p className="text-white/80">
                  Regional statistics across all localities
                </p>
              </div>

              {loadingCityAvg ? (
                <div className="text-center text-gray-400">
                  Calculating averages...
                </div>
              ) : cityAverages ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Median Price"
                    value={`₹${cityAverages.medianPrice.toLocaleString()}`}
                    icon={IndianRupee}
                    subtitle="Average property price"
                    tooltip="Computed across all localities"
                    glass
                  />
                  <StatCard
                    title="Air Quality Index"
                    value={cityAverages.aqi}
                    icon={Wind}
                    subtitle={
                      cityAverages.aqi > 200
                        ? "Poor"
                        : cityAverages.aqi > 150
                        ? "Moderate"
                        : "Good"
                    }
                    tooltip="Average AQI across city"
                    status={
                      cityAverages.aqi > 200
                        ? "poor"
                        : cityAverages.aqi > 150
                        ? "moderate"
                        : "good"
                    }
                    glass
                  />
                  <StatCard
                    title="Safety Index"
                    value={`${cityAverages.crimeIndex}`}
                    icon={Shield}
                    subtitle="Average reported crimes"
                    tooltip="Mean total crimes across all areas"
                    status={
                      cityAverages.crimeIndex < 300
                        ? "good"
                        : cityAverages.crimeIndex < 600
                        ? "moderate"
                        : "poor"
                    }
                    glass
                  />
                  <StatCard
                    title="Transit / Walkability"
                    value={`${cityAverages.transitScore}`}
                    icon={Train}
                    subtitle="Connectivity & amenities"
                    tooltip="Mean walkability across all areas"
                    status={
                      cityAverages.transitScore > 80
                        ? "good"
                        : cityAverages.transitScore > 60
                        ? "moderate"
                        : "poor"
                    }
                    glass
                  />
                </div>
              ) : (
                <div className="text-center text-red-400">
                  Could not load averages.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">
              Data-Driven Neighborhood Insights
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Make confident decisions with comprehensive analytics across
              multiple dimensions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Price Analysis",
                description:
                  "Historical trends, price distributions, and purchase price correlations.",
              },
              {
                icon: Shield,
                title: "Crime & Safety",
                description:
                  "Incident reports, safety ratings, and neighborhood comparisons.",
              },
              {
                icon: Train,
                title: "Transit Access",
                description:
                  "Metro proximity, bus routes, and commute time estimates.",
              },
              {
                icon: UtensilsCrossed,
                title: "Lifestyle Scores",
                description:
                  "Restaurants, cafes, entertainment, and shopping options.",
              },
              {
                icon: Wind,
                title: "Air Quality",
                description:
                  "Real-time AQI monitoring and historical pollution data.",
              },
              {
                icon: HomeIcon,
                title: "Interactive Maps",
                description:
                  "Explore neighborhoods visually with customizable overlays.",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-card p-6 rounded-lg border border-border hover-lift hover:border-primary/50 transition-all glass-card"
                >
                  <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4 hover-scale">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-12 text-center glass-panel-dark hover-glow">
            <h2 className="text-3xl font-semibold mb-4 text-white">
              Ready to Find Your Perfect Neighborhood?
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Access detailed analytics, compare multiple areas, and export data
              for offline analysis.
            </p>
            <Button
              size="lg"
              className="h-12 px-8 hover-lift bg-primary/90 hover:bg-primary text-primary-foreground"
              onClick={() => onNavigate("overview")}
            >
              Start Exploring
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
