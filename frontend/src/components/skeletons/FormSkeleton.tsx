import { Skeleton } from "@/components/ui/skeleton";

export default function FormSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
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

      <div className="ml-60">
        {/* Header */}
        <div className="fixed left-60 right-0 top-0 h-14 border-b bg-white px-6 flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* Form content */}
        <main className="pt-14 p-6 min-h-screen">
          {/* Page title */}
          <div className="mb-6 space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-3 w-56" />
          </div>

          {/* Form card */}
          <div className="max-w-2xl rounded-lg border p-6 space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="flex gap-3 pt-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
