"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";

interface AnimatedPanelProps {
  children: ReactNode;
  className?: string;
}

export default function AnimatedPanel({ children, className }: AnimatedPanelProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={cn(
        "transform-gpu transition-all duration-300 ease-out motion-reduce:transform-none motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}
