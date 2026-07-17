import {
  Container,
  Package,
  Home,
  Briefcase,
  Building2,
  Warehouse,
  Snowflake,
  Wrench,
  Globe,
  Smile,
  Truck,
  ShieldCheck,
  Box,
  type LucideIcon,
} from "lucide-react";

/** Curated map of the lucide icon names referenced by seed data. */
const ICONS: Record<string, LucideIcon> = {
  container: Container,
  package: Package,
  home: Home,
  briefcase: Briefcase,
  "building-2": Building2,
  warehouse: Warehouse,
  snowflake: Snowflake,
  wrench: Wrench,
  globe: Globe,
  smile: Smile,
  truck: Truck,
  "shield-check": ShieldCheck,
};

export function Icon({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) {
  const Cmp = (name && ICONS[name]) || Box;
  return <Cmp className={className} />;
}
