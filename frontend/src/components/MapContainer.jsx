import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin, Layers, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export function MapContainer({ title, showControls = true, markers = [], height = "500px" }) {
  const [clustering, setClustering] = useState(true);

  return (
    <Card className="overflow-hidden">
      {title && (
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {showControls && (
            <div className="flex items-center gap-2">
              <Badge
                variant={clustering ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setClustering(!clustering)}
              >
                <Layers className="h-3 w-3 mr-1" />
                {clustering ? "Clustering On" : "Clustering Off"}
              </Badge>
            </div>
          )}
        </CardHeader>
      )}
      <CardContent className="p-0 relative">
        <div
          className="bg-muted relative"
          style={{ height }}
        >
          {/* Map placeholder with grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Mock markers */}
          {markers.slice(0, clustering ? 5 : markers.length).map((marker, index) => (
            <div
              key={marker.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
              style={{
                left: `${20 + (index * 15) % 60}%`,
                top: `${30 + (index * 12) % 40}%`,
              }}
            >
              <div className="relative">
                <MapPin className="h-8 w-8 text-primary fill-primary/20" />
                {marker.value && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                    {marker.value}
                  </Badge>
                )}
              </div>
            </div>
          ))}

          {/* Map controls */}
          {showControls && (
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <Button size="icon" variant="secondary" className="h-8 w-8 shadow-md">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" className="h-8 w-8 shadow-md">
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-card p-3 rounded-lg shadow-md border border-border">
            <div className="text-xs font-medium mb-2">Legend</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <div className="h-3 w-3 rounded-full bg-chart-1" />
                <span>Low Price (<₹15k)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="h-3 w-3 rounded-full bg-chart-4" />
                <span>Medium (₹15k-25k)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="h-3 w-3 rounded-full bg-chart-5" />
                <span>High (>₹25k)</span>
              </div>
            </div>
          </div>

          {/* Mock label */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-card px-4 py-2 rounded-lg shadow-md border border-border">
            <p className="text-sm font-medium">Delhi NCR - Locality Overview</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
