"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "./utils";

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    {...props}
    className={cn(
      // Base track
      "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border border-white/20 transition-colors duration-300 ease-in-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary/60 data-[state=unchecked]:bg-gray-600/60 backdrop-blur-md",
      className
    )}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        // White thumb (the circle)
        "block h-5 w-5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] ring-0 transform", // <-- Added 'transform'
        "transition-transform duration-300 ease-in-out",
        // Slide motion
        "data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-[2px]" // <-- fixed distances
      )}
    />
  </SwitchPrimitive.Root>
));

Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
