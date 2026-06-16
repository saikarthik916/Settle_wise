import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Download, Loader2 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export function ChartCard({
  title,
  description,
  children,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "No data available",
  onExport,
  actions,
}) {
  return (
    <Card className="glass-panel hover-lift">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-white">{title}</CardTitle>
          {description && <CardDescription className="text-white/70">{description}</CardDescription>}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport} disabled={isLoading || isEmpty} className="border-primary/30 text-white hover:bg-primary/20">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-[300px] w-full bg-primary/10" />
            <div className="flex justify-center items-center gap-2 text-white/70 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading data...
            </div>
          </div>
        ) : isEmpty ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-white/70 text-sm">{emptyMessage}</p>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
