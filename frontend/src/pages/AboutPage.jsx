// frontend/src/pages/AboutPage.jsx
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Calendar, Database, TrendingUp } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

import { fetchAreas, fetchCityAverages } from "../lib/api";

export function AboutPage() {
  const [stats, setStats] = useState({
    totalAreas: 0,
    avgAQI: 0,
    medianPrice: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [areas, city] = await Promise.all([
          fetchAreas(),
          fetchCityAverages(),
        ]);

        setStats({
          totalAreas: areas?.length || 0,
          avgAQI: city?.aqi || 0,
          medianPrice: city?.medianPrice || 0,
        });
      } catch (err) {
        console.error("Failed to fetch about page stats", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const dataSources = [
    {
      name: "Housing Data",
      type: "Preprocessed JSON",
      lastUpdated: "2025-10-15",
      recordCount: stats.totalAreas,
    },
    {
      name: "Others Data (AQI, Crime, Transit)",
      type: "Preprocessed JSON",
      lastUpdated: "2025-10-15",
      recordCount: stats.totalAreas,
    },
    {
      name: "Restaurant Data",
      type: "Preprocessed JSON",
      lastUpdated: "2025-10-15",
      recordCount: stats.totalAreas,
    },
    {
      name: "City Averages",
      type: "Backend Aggregation",
      lastUpdated: "2025-10-15",
      recordCount: 1,
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-white">About SettleWise</h1>
        <p className="text-white/70">
          Methodology and data sources for neighborhood comparison
        </p>
      </div>

      <div className="space-y-6">
        {/* 🔹 Project Overview */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-white">Project Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white/90">
              SettleWise analyzes and compares localities across Delhi NCR based on real,
              preprocessed data from multiple backend endpoints such as <code>/data/housing</code>,
              <code>/data/others</code>, and <code>/data/restaurants</code>.
              It helps users visualize housing trends, air quality, safety, and nearby amenities.
            </p>

            <p className="text-white/90">
              The data pipeline is powered by a FastAPI backend that reads preprocessed JSON datasets.
              Each dataset is derived from curated sources and combined into summary metrics
              like average AQI, total crimes, median housing price, and walkability score.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 glass-card rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary mb-2" />
                <h4 className="text-white">
                  {loading ? "—" : `₹${stats.medianPrice.toLocaleString()}`}
                </h4>
                <p className="text-white/70">Median City Price</p>
              </div>
              <div className="p-4 glass-card rounded-lg">
                <Database className="h-6 w-6 text-secondary mb-2" />
                <h4 className="text-white">
                  {loading ? "—" : `${stats.totalAreas} Areas`}
                </h4>
                <p className="text-white/70">Analyzed from Backend</p>
              </div>
              <div className="p-4 glass-card rounded-lg">
                <Calendar className="h-6 w-6 text-accent mb-2" />
                <h4 className="text-white">
                  {loading ? "—" : `AQI ${stats.avgAQI}`}
                </h4>
                <p className="text-white/70">Average Air Quality</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 🔹 Data Sources */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-white">Data Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white/80">Source</TableHead>
                  <TableHead className="text-white/80">Type</TableHead>
                  <TableHead className="text-white/80">Last Updated</TableHead>
                  <TableHead className="text-white/80">Records</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataSources.map((source, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-white">{source.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-primary/40 text-white/80"
                      >
                        {source.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white/70">
                      {source.lastUpdated}
                    </TableCell>
                    <TableCell className="text-white/70">
                      {source.recordCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <p className="text-white/70 mt-4">
              All datasets are preprocessed and stored locally and in MinIO. Each is analyzed and
              summarized to provide fast and consistent responses to frontend requests.
            </p>
          </CardContent>
        </Card>

        {/* 🔹 Methodology */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-white">Methodology</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="housing">
                <AccordionTrigger className="text-white">
                  Housing Price Analysis
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside text-white/80 ml-3 space-y-1">
                    <li>Derived from real housing data in `/data/housing` JSONs</li>
                    <li>Summaries include median and average price per locality</li>
                    <li>Used for city-wide price trend comparisons</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="others">
                <AccordionTrigger className="text-white">
                  AQI, Crime & Transit Data
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside text-white/80 ml-3 space-y-1">
                    <li>Collected from `/data/others` endpoint</li>
                    <li>Summaries include AQI, total crimes, and walkability score</li>
                    <li>Used to calculate city averages and comparative charts</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="restaurants">
                <AccordionTrigger className="text-white">
                  Restaurant Distribution
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside text-white/80 ml-3 space-y-1">
                    <li>Data loaded from `/data/restaurants`</li>
                    <li>Contains restaurant counts and rating histograms</li>
                    <li>Helps evaluate local lifestyle quality</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="city">
                <AccordionTrigger className="text-white">
                  City Averages
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside text-white/80 ml-3 space-y-1">
                    <li>Computed server-side from all locality summaries</li>
                    <li>Used as benchmark for comparison in Overview Page</li>
                    <li>Includes medianPrice, AQI, crimeIndex, and transitScore</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* 🔹 Disclaimer */}
        <Card className="glass-panel border-warning/50">
          <CardHeader>
            <CardTitle className="text-white">Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-white/90">
              SettleWise provides data-driven insights from static backend datasets. While the data
              is carefully preprocessed, users should verify information before making housing or
              investment decisions.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
              <li>All numbers represent averages and may not reflect real-time values</li>
              <li>Backend data updates periodically as new reports are processed</li>
              <li>Environmental and safety data may vary with time</li>
            </ul>
            <p className="text-white/70">
              This platform is for research and awareness only. The maintainers are not responsible
              for financial or real estate outcomes based on this data.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
