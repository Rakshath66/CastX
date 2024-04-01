import { getStreams } from "@/lib/feed-service";
import { Skeleton } from "@/components/ui/skeleton";

// import { ResultCard, ResultCardSkeleton } from "./result-card";

export const Results = async () => {
    const data = await getStreams();

    return (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Streams we think you&apos;ll like
          </h2>
          
        </div>
    )
}

export const ResultsSkeleton = () => {
    return (
      <div>
        <Skeleton className="h-8 w-[290px] mb-4" />
      </div>
    );
};