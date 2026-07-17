import Link from "next/link";
import { cn } from "@/lib/utils";

/** Wordmark. `light` flips colours for use over dark backgrounds (hero). */
export function Logo({
  light = false,
  className,
}: {
  light?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "font-heading text-2xl font-bold uppercase leading-none tracking-tight",
        className,
      )}
    >
      <span className={light ? "text-brand-300" : "text-brand-700"}>Box</span>
      <span className={light ? "text-white" : "text-foreground"}>Space</span>
    </Link>
  );
}
