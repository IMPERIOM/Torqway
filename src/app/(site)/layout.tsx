import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/whatsapp/floating-whatsapp";
import { QuoteCartProvider } from "@/components/quote/quote-cart-provider";
import { getSettings } from "@/lib/settings";
import { buildWhatsAppLink } from "@/lib/format";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const whatsappLink = buildWhatsAppLink(
    settings.whatsappNumber,
    settings.whatsappMessage,
  );

  return (
    <QuoteCartProvider>
      <Navbar whatsappLink={whatsappLink} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer settings={settings} whatsappLink={whatsappLink} />
      <FloatingWhatsApp href={whatsappLink} />
    </QuoteCartProvider>
  );
}
