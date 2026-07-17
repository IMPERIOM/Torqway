"use client";

import { motion } from "framer-motion";
import { WhatsAppIcon } from "./whatsapp-icon";

/**
 * Floating WhatsApp button — present on every page via the (site) layout.
 * `href` is a prebuilt wa.me link from the app_settings-backed config.
 */
export function FloatingWhatsApp({ href }: { href: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      data-analytics="whatsapp_click"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-whatsapp p-4 text-whatsapp-foreground shadow-lg shadow-black/20 sm:bottom-6 sm:right-6"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-whatsapp opacity-30" />
      <WhatsAppIcon className="relative h-7 w-7" />
      <span className="relative hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[10rem] sm:inline-block">
        Chat with us
      </span>
    </motion.a>
  );
}
