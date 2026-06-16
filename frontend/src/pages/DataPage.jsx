// frontend/src/pages/DataPage.jsx
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import {
  fetchAreas,
  fetchHousing,
  fetchOthers,
} from "../lib/api";

export function DataPage() {
  const [dataset, setDataset] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Fetch all areas and their data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const areas = await fetchAreas();
        const results = [];

        for (const area of areas) {
          const areaName = area.safe || area.address;

          try {
            const [housing, others] = await Promise.all([
              fetchHousing(areaName),
              fetchOthers(areaName),
            ]);

            results.push({
              name: area.address,
              medianPrice:
                housing?.summary?.median_price ??
                housing?.summary?.avg_price ??
                null,
              aqi:
                housing?.summary?.avg_aqi ??
                others?.summary?.avg_aqi ??
                null,
              crimeIndex:
                others?.summary?.total_crimes ??
                others?.summary?.avg_crime_index ??
                null,
              transitScore:
                others?.summary?.walkability_score ??
                others?.summary?.safety_index ??
                null,
              lat: Math.random() * 0.5 + 28.4, // optional placeholder
              lng: Math.random() * 0.5 + 77.0, // optional placeholder
            });
          } catch (innerErr) {
            console.warn(`Skipping ${areaName}:`, innerErr);
          }
        }

        setDataset(results);
      } catch (err) {
        console.error("❌ Failed to fetch dataset", err);
        setError("Failed to load dataset from backend.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleExport = (format) => {
    toast.success(`Dataset exported as ${format.toUpperCase()}`);
  };

  const totalPages = Math.ceil(dataset.length / parseInt(rowsPerPage));
  const paginatedData = dataset.slice(
    (currentPage - 1) * parseInt(rowsPerPage),
    currentPage * parseInt(rowsPerPage)
  );

  // 🔹 Loading & Error states
  if (loading)
    return (
      <div className="text-center text-gray-400 py-12">
        Loading full dataset from backend...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-400 py-12">{error}</div>
    );

  if (!dataset.length)
    return (
      <div className="text-center text-gray-400 py-12">
        No data available.
      </div>
    );

  // ✅ Main UI
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2 text-white">Datasets</h1>
        <p className="text-white/70">
          Live dataset fetched from backend for all localities
        </p>
      </div>

      {/* Dataset Explorer */}
      <Card>
        <CardHeader>
          <CardTitle>Dataset Explorer</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-end">
            <div className="flex gap-2">
              <Select
                value={rowsPerPage}
                onValueChange={(value) => {
                  setRowsPerPage(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 rows</SelectItem>
                  <SelectItem value="25">25 rows</SelectItem>
                  <SelectItem value="50">50 rows</SelectItem>
                  <SelectItem value="100">100 rows</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Area Name</TableHead>
                    <TableHead>Median Price</TableHead>
                    <TableHead>AQI</TableHead>
                    <TableHead>Crime Index</TableHead>
                    <TableHead>Transit Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell>
                          {row.medianPrice
                            ? `₹${Math.round(row.medianPrice).toLocaleString()}`
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              row.aqi > 200
                                ? "destructive"
                                : row.aqi > 150
                                ? "secondary"
                                : "default"
                            }
                          >
                            {row.aqi ?? "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>{row.crimeIndex ?? "N/A"}</TableCell>
                        <TableCell>{row.transitScore ?? "N/A"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-muted-foreground"
                      >
                        No results found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * parseInt(rowsPerPage) + 1} to{" "}
              {Math.min(currentPage * parseInt(rowsPerPage), dataset.length)} of{" "}
              {dataset.length} results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
