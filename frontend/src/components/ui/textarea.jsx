"use client";

import * as React from "react";
import { cn } from "./utils";

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex h-20 w-full rounded-md border px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
