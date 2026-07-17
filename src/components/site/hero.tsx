"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppCTA } from "@/components/whatsapp/whatsapp-cta";

export type HeroCta = { label: string; href: string; variant?: string };

export function Hero({
  title,
  subtitle,
  tagline,
  videoUrl,
  posterUrl,
  ctas,
  whatsappLink,
}: {
  title: string;
  subtitle?: string | null;
  tagline?: string | null;
  videoUrl?: string | null;
  posterUrl?: string | null;
  ctas: HeroCta[];
  whatsappLink: string;
}) {
  return (
    <section className="relative -mt-16 flex min-h-[88vh] items-center justify-center overflow-hidden">
      {videoUrl ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={posterUrl ?? undefined}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <div className="absolute inset-0 bg-brand-800" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-950/80 via-brand-950/70 to-brand-950/85" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
        {tagline && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-brand-300"
          >
            {tagline}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-4xl font-bold uppercase leading-tight tracking-tight sm:text-6xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-brand-100"
          >
            {subtitle}
          </motion.p>
        )}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          {ctas.map((cta) => {
            if (cta.href === "whatsapp" || cta.variant === "whatsapp") {
              return (
                <WhatsAppCTA
                  key={cta.label}
                  href={whatsappLink}
                  label={cta.label}
                  size="lg"
                />
              );
            }
            if (cta.variant === "secondary") {
              return (
                <Button
                  key={cta.label}
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                >
                  <Link href={cta.href}>{cta.label}</Link>
                </Button>
              );
            }
            return (
              <Button
                key={cta.label}
                asChild
                size="lg"
                className="bg-white text-brand-800 hover:bg-brand-50"
              >
                <Link href={cta.href}>
                  {cta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
