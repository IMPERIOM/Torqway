import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "./whatsapp-icon";

type WhatsAppCTAProps = {
  href: string;
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses: Record<NonNullable<WhatsAppCTAProps["size"]>, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
};

/**
 * Shared WhatsApp call-to-action used on product pages, the quote form, the
 * footer and the mobile nav. Presentational — pass a prebuilt wa.me href.
 */
export function WhatsAppCTA({
  href,
  label = "Chat on WhatsApp",
  className,
  size = "md",
}: WhatsAppCTAProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-analytics="whatsapp_click"
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium text-whatsapp-foreground transition-colors",
        "bg-whatsapp hover:bg-whatsapp/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp/50",
        sizeClasses[size],
        className,
      )}
    >
      <WhatsAppIcon className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
      {label}
    </a>
  );
}
