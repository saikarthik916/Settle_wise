"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "./utils";

const Separator = React.forwardRef(
  ({ className, decorative = true, ...props }, ref) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      className={cn("bg-border -mx-1 h-px shrink-0", className)}
      {...props}
    />
  )
);
Separator.displayName = "Separator";

export { Separator };
