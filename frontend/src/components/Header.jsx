import {
  Home,
  MapIcon,
  BarChart3,
  Shield,
  Train,
  UtensilsCrossed,
  Database,
  Info,
} from "lucide-react";
import { Button } from "./ui/button";
import mapImage from "@/assets/logo.png";

const navigation = [
  { id: "home", label: "Home", icon: Home },
  { id: "price", label: "Price", icon: BarChart3 },
  { id: "crime", label: "Safety", icon: Shield },
  { id: "lifestyle", label: "Lifestyle", icon: UtensilsCrossed },
  { id: "data", label: "Data", icon: Database },
  { id: "about", label: "About", icon: Info },
];

export function Header({ currentPage, onNavigate }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 glass-panel-dark backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="h-10 w-10 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img
                src={mapImage}
                alt="Map Icon"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col items-start">
              <span className="font-semibold text-lg leading-none text-white">
                SettleWise
              </span>
              <span className="text-[10px] text-white/60 leading-none mt-0.5">
                Delhi NCR
              </span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onNavigate(item.id)}
                  className={`gap-2 text-white hover:bg-primary/20 ${
                    isActive ? "bg-primary/30 hover-glow" : ""
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
