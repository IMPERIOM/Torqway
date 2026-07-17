"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { Icon } from "./lucide-icon";

export function StatCounter({
  value,
  label,
  suffix,
  prefix,
  icon,
}: {
  value: number;
  label: string;
  suffix?: string | null;
  prefix?: string | null;
  icon?: string | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-700/10 text-brand-700">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <div className="font-heading text-4xl font-bold text-brand-700 sm:text-5xl">
        {prefix}
        {Math.round(display).toLocaleString()}
        {suffix}
      </div>
      <div className="mt-1 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
