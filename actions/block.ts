"use server";

import { revalidatePath } from "next/cache";
import { RoomServiceClient } from "livekit-server-sdk";

import { getSelf } from "@/lib/auth-service";
import { blockUser, unblockUser } from "@/lib/block-service"

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_API_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!,
);


// if user is blocked/unblocked, refresh the root and blocked/unblocked user pages
export const onBlock = async (id: string) => {
    // TODO: Adapt to disconnect from livestream
    // TODO: Allow ability to kick the guest
    const self = await getSelf();
    //to be able to block guest

    let blockedUser;

    try {
        blockedUser = await blockUser(id);
    } catch {
        // This means user is a guest
    }

    try { //room number, user to block
        await roomService.removeParticipant(self.id, id);
    } catch {
        // This means user is not in the room
    }

    revalidatePath(`/u/${self.username}/community`);
    //guest can clear cache and again enter in incognitos - so only following options in chat

    return blockedUser;
}

export const onUnblock = async (id: string) => {
    const unblockedUser = await unblockUser(id);

    revalidatePath("/");

    if(unblockedUser) {
        revalidatePath(`/${unblockedUser.blocked.username}`);
    }

    return unblockedUser;
}