"use client";

import * as React from "react";
import { cn } from "./utils";

const Toggle = React.forwardRef(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md p-2",
      className
    )}
    {...props}
  >
    {children}
  </button>
));
Toggle.displayName = "Toggle";

export { Toggle };
