import { db } from "./db";
import { getSelf } from "./auth-service";

// recent created users first
export const getRecommended = async () => {
    // await new Promise(resolve => setTimeout(resolve, 5000));

    const users = await db.user.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })

    return users;
}