"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "./utils";

const ToggleGroup = ToggleGroupPrimitive.Root;
const Toggle = React.forwardRef(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md px-2 py-1 text-sm",
      className
    )}
    {...props}
  />
));
Toggle.displayName = "Toggle";

export { ToggleGroup, Toggle };
