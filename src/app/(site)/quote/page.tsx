import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { QuoteClient } from "@/components/quote/quote-client";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Review your selected containers and modular spaces and request a tailored, no-obligation quote from BoxSpace.",
};

export default function QuotePage() {
  return (
    <>
      <PageHeader
        title="Request a Quote"
        description="Review your items, add any custom requirements, and our team will send you a competitive quote."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Request Quote" }]}
      />
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <QuoteClient />
        </div>
      </section>
    </>
  );
}
