// frontend/src/components/AreaSelector.jsx
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useArea } from "../context/AreaContext";
import { fetchLocalities } from "../lib/api";

export function AreaSelector({ placeholder = "Select area..." }) {
  const [open, setOpen] = useState(false);
  const { selectedArea, setSelectedArea, localities, setLocalities } =
    useArea();

  useEffect(() => {
    fetchLocalities()
      .then((data) => {
        // The backend returns [{address, safe}]
        const formatted = data.map((a) => ({ id: a.safe, name: a.address }));
        setLocalities(formatted);
      })
      .catch((err) => console.error("Error loading localities:", err));
  }, [setLocalities]);

  const selected = localities.find((a) => a.name === selectedArea);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between glass-card hover-glow text-white border-primary/30"
        >
          {selected ? selected.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[400px] p-0 glass-panel border-primary/30"
        align="start"
        style={{ backdropFilter: "blur(25px)" }}
      >
        <Command className="bg-transparent">
          <CommandInput
            placeholder="Search area..."
            className="text-white placeholder:text-white/50"
          />
          <CommandList>
            <CommandEmpty className="text-white/70">
              No area found.
            </CommandEmpty>
            <CommandGroup>
              {localities.map((area) => (
                <CommandItem
                  key={area.id}
                  value={area.name}
                  onSelect={() => {
                    setSelectedArea(area.name);
                    setOpen(false);
                  }}
                  className="text-white hover:bg-primary/20 hover-glow cursor-pointer transition-all"
                >
                  <Check
                    className={`mr-2 h-4 w-4 text-primary ${
                      selectedArea === area.name ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {area.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
