import Link from "next/link";
import { Stream, User } from "@prisma/client";

import { Skeleton } from "@/components/ui/skeleton";
import { LiveBadge } from "@/components/live-badge";
import { UserAvatar, UserAvatarSkeleton } from "@/components/user-avatar";

interface ResultCardProps {
    data: {
      user: User,
      isLive: boolean;
      name: string;
      thumbnailUrl: string | null;
    };
};

export const ResultCard = ({
    data,
  }: ResultCardProps) => {
    return (
      <Link href={`/${data.user.username}`}>
        <div className="h-full w-full space-y-4">
          <div className="flex gap-x-3">
            <UserAvatar
              username={data.user.username}
              imageUrl={data.user.imageUrl}
              isLive={data.isLive}
            />
            <div className="flex flex-col text-sm overflow-hidden">
              <p className="truncate font-semibold hover:text-blue-500">
                {data.name}
              </p>
              <p className="text-muted-foreground">
                {data.user.username}
              </p>
            </div>
          </div>
        </div>
      </Link>
    );
};

export const ResultCardSkeleton = () => {
    return (
      <div className="h-full w-full space-y-4">
        
      </div>
    );
};