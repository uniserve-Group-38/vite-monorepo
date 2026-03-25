import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnnouncementDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Back button skeleton */}
      <Skeleton className="h-10 w-40 mb-6" />

      <Card>
        <CardHeader>
          {/* Badge and verified skeleton */}
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>

          {/* Title skeleton */}
          <Skeleton className="h-9 w-full mb-2" />

          {/* Date skeleton */}
          <Skeleton className="h-4 w-64" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Content skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* CTA skeleton */}
          <div className="pt-4 border-t space-y-3">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}