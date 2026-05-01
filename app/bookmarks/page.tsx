import type { Metadata } from "next";
import BookmarksClient from "@/components/bookmarks-client";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Saved Articles",
  description: `Your bookmarked articles on ${SITE.name}. Stories worth a second read.`,
  alternates: { canonical: "/bookmarks" },
  robots: {
    // The bookmarks page is per-user, client-side state — nothing here for
    // search engines to index.
    index: false,
    follow: true,
  },
};

export default function BookmarksPage() {
  return <BookmarksClient />;
}
