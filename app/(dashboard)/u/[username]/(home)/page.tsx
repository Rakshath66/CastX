import { StreamPlayer } from "@/components/stream-player/index";
import { getUserByUsername } from "@/lib/user-service";
import { currentUser } from "@clerk/nextjs";

interface CreatorPageProps {
    params: {
        username: string;
    }
}

const CreatorPage = async ({
   params,
}: CreatorPageProps) => {
    const externalUser = await currentUser();
    const user = await getUserByUsername(params.username);

    // if external user not a required user, cannot access. -> no danger for stream(getting whole from db).
    if(!user || externalUser?.id !== user.externalUserId || !user.stream) {
        throw new Error("Unauthorized");
    }

    return (
        <div className="h-full">
            <StreamPlayer
              user={user}
              stream={user.stream}
              isFollowing
            />
        </div>
    )
}

export default CreatorPage;