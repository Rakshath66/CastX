import { Skeleton } from "@/components/ui/skeleton";



interface ResultsProps {
  term?: string;
};

export const Results = async ({
    term,
}: ResultsProps) => {

    return (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Results for term &quot;{term}&quot;
          </h2>
        </div>
    );
};

export const ResultsSkeleton = () => {
    return (
      <div>
        <Skeleton className="h-8 w-[290px] mb-4" />
      </div>
    );
};