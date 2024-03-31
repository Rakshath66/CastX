import { useMemo } from "react";
import { Info } from "lucide-react";

import { Hint } from "@/components/hint";

interface ChatInfoProps {
    isDelayed: boolean;
    isFollowersOnly: boolean;
}

export const ChatInfo = ({
    isDelayed,
    isFollowersOnly
}: ChatInfoProps) => {
    const hint = useMemo(() => {
        if (isFollowersOnly && !isDelayed) {  //not delayed - not followers 
            return "Only Followers can chat";
        }

        if (isDelayed && !isFollowersOnly) { //delayed - followers
            return "Messages are delayed by 3 seconds";
        }

        if (isDelayed && isFollowersOnly) { //delayed - not followers
            return "Only Followers can chat. Messages are delayed by 3 seconds"
        }

        return "";
    }, [isDelayed, isFollowersOnly]);

    const label = useMemo(() => {
        if (isFollowersOnly && !isDelayed) {
            return "Followers Only";
        }

        if (isDelayed && !isFollowersOnly) {
            return "Slow mode";
        }

        if (isDelayed && isFollowersOnly) {
            return "Followers Only and Slow mode";
        }
    }, [isDelayed, isFollowersOnly]);

    //normal chat - not delayed, followers
    if(!isDelayed && !isFollowersOnly) {
        return null;
    }

    return (
        <div className="p-2 text-muted-foreground bg-white/5 border border-white/10 w-full rounded-t-md flex items-center gap-x-2">
            <Hint label={hint}>
                <Info className="h-4 w-4" />
            </Hint>
            <p className="text-xs font-semibold">
                {label}
            </p>
        </div>
    )
}