import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Info } from "lucide-react";

export function StatCard({ title, value, icon: Icon, trend, subtitle, tooltip, status, glass }) {
  const statusColor = {
    good: "bg-success/10 text-success border-success/20",
    moderate: "bg-warning/10 text-warning border-warning/20",
    poor: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <Card className={`relative overflow-hidden hover-lift ${glass ? 'glass-panel' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm text-white/80 flex items-center gap-2">
          {title}
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-white/70 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="glass-panel border-primary/30">
                  <p className="max-w-xs text-xs text-white">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardTitle>
        <div className={`p-2 rounded-lg ${status ? statusColor[status] : "bg-primary/20"}`}>
          <Icon className={`h-4 w-4 ${status ? "" : "text-primary"}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold text-white">{value}</div>
        {subtitle && <p className="text-xs text-white/70 mt-1">{subtitle}</p>}
        {trend && (
          <Badge
            variant="outline"
            className={`mt-2 ${
              trend.isPositive ? "border-success/50 text-success" : "border-destructive/50 text-destructive"
            }`}
          >
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
