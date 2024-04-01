"use server";

import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";

//update user bio, refresh routes from where modification is done
export const updateUser = async (values: Partial<User>) => {
    const self = await getSelf();

    //update bio, updating username and everything in clerk webhook - so not modifying here, bio doesn't exist in clerk. so updating by ourself
    const validData = {
        bio: values.bio,
    };
    
    const user = await db.user.update({
        where: { id: self.id },
        data: { ...validData }
    });
    
    //owner of stream can modify their bio in both routes
    revalidatePath(`/${self.username}`);
    revalidatePath(`/u/${self.username}`);
    
    return user;
};