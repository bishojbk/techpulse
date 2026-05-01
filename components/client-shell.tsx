"use client";

import { Sidebar } from "@/components/sidebar";
import { BackToTop } from "@/components/back-to-top";
import { ArticlesProvider } from "@/hooks/articles-context";

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <ArticlesProvider>
      <div className="lg:grid lg:min-h-screen lg:[grid-template-columns:248px_1fr]">
        <Sidebar />
        <main className="min-w-0">{children}</main>
      </div>
      <BackToTop />
    </ArticlesProvider>
  );
}
