import type { Metadata } from "next";
import HomeClient from "@/components/home-client";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description:
    "Today's wire — curated tech, AI, security, and science from 20+ sources. Updated continuously, no ads, no fluff.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description:
      "Today's wire — curated tech, AI, security, and science from 20+ sources.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description:
      "Today's wire — curated tech, AI, security, and science from 20+ sources.",
  },
};

export default function HomePage() {
  return <HomeClient />;
}
