import { db } from "./db";
import { getSelf } from "./auth-service";

// recent created users first
export const getRecommended = async () => {
    // await new Promise(resolve => setTimeout(resolve, 5000));
    let userId;

    try {
        const self = await getSelf();
        userId = self.id;
    } catch {
        userId = null;
    }

    let users = [];

    // (if user is me) or (if i follow the user,) dont show me and him in recommended list
    //  recommend the user, if user is not me and not the ones i follow
    //  and if they not blocked me
    if(userId) {
        users = await db.user.findMany({
            where: {
                AND: [
                    {
                        NOT: {
                            id: userId,
                        }
                    },
                    {
                        NOT: {
                            followedBy: {
                                some: {
                                    followerId: userId,
                                }
                            }
                        },
                    },
                    {
                        NOT: {
                            blocking: {
                                some: {
                                    blockedId: userId,
                                }
                            }
                        },
                    },
                ],
            },
            orderBy: {
                createdAt: "desc"
            }
        })
    }
    else {
        users = await db.user.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })
    }

    return users;
}