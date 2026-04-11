"use client";

import { Header } from "@/components/header";
import { CategoryBar } from "@/components/category-bar";
import { Footer } from "@/components/footer";
import { BackToTop } from "@/components/back-to-top";
import { ArticlesProvider } from "@/hooks/articles-context";

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <ArticlesProvider>
      <Header />
      <CategoryBar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </ArticlesProvider>
  );
}
