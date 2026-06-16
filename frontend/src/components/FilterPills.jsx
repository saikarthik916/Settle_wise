import { X } from "lucide-react";
import { Badge } from "./ui/badge";

export function FilterPills({ filters, onRemove }) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Badge key={filter.id} variant="secondary" className="px-3 py-1 gap-1.5">
          <span className="text-xs">{filter.label}:</span>
          <span className="text-xs font-semibold">{filter.value}</span>
          <button
            onClick={() => onRemove(filter.id)}
            className="ml-1 hover:bg-foreground/10 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}
