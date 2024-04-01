"use server";

import { revalidatePath } from "next/cache";

import { 
  followUser, 
  unfollowUser
} from "@/lib/follow-service";

export const onFollow = async (id: string) => {
    try {
        // console.log("I am the same as an API Call");
        const followedUser = await followUser(id);
        
        //refresh recommended users
        revalidatePath("/");

        //refresh the username of user i followed
        if (followedUser) {
            revalidatePath(`/${followedUser.following.username}`);
        }

        return followedUser;
        
    } catch (error) {
        throw new Error("Internal Error");
    }
}

export const onUnfollow = async (id: string) => {
    try {
        const unfollowedUser = await unfollowUser(id);
        // console.log(unfollowedUser);

        revalidatePath("/");

        if (unfollowedUser) {
            revalidatePath(`/${unfollowedUser.following.username}`);
        }

        return unfollowedUser;
    } catch (error) {
        throw new Error("Internal Error");
    }
}