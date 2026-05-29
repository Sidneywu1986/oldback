import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonLayout() {
  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar skeleton */}
      <div className="fixed left-0 top-0 h-full w-60 border-r bg-white p-4">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>

      {/* Main area */}
      <div className="ml-60">
        {/* Header skeleton */}
        <div className="fixed left-60 right-0 top-0 h-14 border-b bg-white px-6 flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* Content skeleton */}
        <main className="pt-14 p-6 min-h-screen">
          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg border p-4 space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>

          {/* Table skeleton */}
          <div className="rounded-lg border">
            <div className="p-4 border-b space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="divide-y">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
