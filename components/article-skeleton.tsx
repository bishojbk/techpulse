import { Skeleton } from "@/components/ui/skeleton";

function LeadSkeleton() {
  return (
    <div className="py-8 border-b border-border">
      <div className="max-w-3xl">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="mt-3 h-10 w-full" />
        <Skeleton className="mt-2 h-10 w-4/5" />
        <Skeleton className="mt-4 h-5 w-full" />
        <Skeleton className="mt-2 h-5 w-3/4" />
        <div className="mt-4 flex items-center gap-3">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

function TopStoriesSkeleton() {
  return (
    <div className="border-b border-border py-8">
      <Skeleton className="h-[3px] w-full mb-4" />
      <Skeleton className="h-3 w-24 mb-5" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-[3px] w-10 mb-1" />
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3.5 w-full" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-3.5 rounded-sm" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ListItemSkeleton() {
  return (
    <div className="flex gap-4 border-b border-border py-5">
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-full hidden sm:block" />
        <div className="flex items-center gap-2 mt-1">
          <Skeleton className="h-3.5 w-3.5 rounded-sm" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
      <Skeleton className="h-8 w-8 shrink-0" />
    </div>
  );
}

export function ArticleSkeletonGrid() {
  return (
    <>
      <LeadSkeleton />
      <TopStoriesSkeleton />
      <div className="grid grid-cols-1 gap-10 py-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Skeleton className="h-[3px] w-full mb-4" />
          <Skeleton className="h-3 w-16 mb-2" />
          {Array.from({ length: 5 }).map((_, i) => (
            <ListItemSkeleton key={i} />
          ))}
        </div>
        <div className="hidden lg:block">
          <Skeleton className="h-[3px] w-full mb-4" />
          <Skeleton className="h-3 w-24 mb-1" />
          <Skeleton className="h-3 w-36 mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 border-b border-border py-4">
              <Skeleton className="h-8 w-8 shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
