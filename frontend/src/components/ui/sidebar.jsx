"use client";

import * as React from "react";
import { cn } from "./utils";

function Sidebar({ children, className, ...props }) {
  return (
    <aside className={cn("w-64 shrink-0 border-r", className)} {...props}>
      {children}
    </aside>
  );
}

export { Sidebar };
