// Root layout — shared shell for both SmartETF and SmartSuper.
// Branding is read from x-site header injected by middleware.
import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

function getSiteConfig(site: string) {
  if (site === "smartsuper") {
    return {
      title: "SmartSuper AU — Superannuation Optimisation",
      description: "Australia's independent super optimisation platform. Contribution strategy, FIRE planning, SMSF analysis.",
      themeColor: "#7F77DD",
    };
  }
  return {
    title: "SmartETF — Australian ETF Portfolio Analyser",
    description: "Scan your ETF portfolio for overlap, fee drag, and diversification gaps. Free portfolio health score.",
    themeColor: "#1D9E75",
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const site = headersList.get("x-site") ?? "smartetf";
  const config = getSiteConfig(site);
  return {
    title: { default: config.title, template: `%s · ${site === "smartsuper" ? "SmartSuper AU" : "SmartETF"}` },
    description: config.description,
    openGraph: { type: "website", title: config.title, description: config.description },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const site = headersList.get("x-site") ?? "smartetf";
  const brand = site === "smartsuper" ? "#7F77DD" : "#1D9E75";
  const brandLight = site === "smartsuper" ? "#EEEDFE" : "#E1F5EE";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen">
        <style>{`:root{--brand:${brand};--brand-light:${brandLight};}`}</style>
        {children}
      </body>
    </html>
  );
}
