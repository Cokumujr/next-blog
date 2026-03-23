import { Skeleton } from "@/components/ui/skeleton";

export default function blogPostLoadingPage() { 
    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <Skeleton className="h-10 w-24 rounded mb-6" />
            <Skeleton className="h-100 w-full rounded-xl mb-8" />
            <div className="space-y-4">
                <Skeleton className="h-12 w-3/4 rounded" />
                <Skeleton className="h-6 w-32 rounded" />
            </div>
            <div className="mt-8 space-y-2">
                <Skeleton className="h-4 w-ful rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />

            </div>

        </div>
    )
}