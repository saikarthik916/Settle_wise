"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cn } from "./utils";

const Sheet = ({ children, className, ...props }) => (
  <SheetPrimitive.Root {...props}>
    <SheetPrimitive.Trigger asChild>{children}</SheetPrimitive.Trigger>
  </SheetPrimitive.Root>
);

export { Sheet };
