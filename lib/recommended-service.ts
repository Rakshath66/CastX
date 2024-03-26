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

    // if user is me, dont show me in recommended list
    if(userId) {
        users = await db.user.findMany({
            where: {
                NOT: {
                    id: userId,
                }
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