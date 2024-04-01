import { db } from "@/lib/db"
import { getSelf } from "@/lib/auth-service"

export const getStreams = async () => {
    let userId;
  
    try {
      const self = await getSelf();
      userId = self.id;
    } catch {
      userId = null;
    }
  
    let streams = [];
  
    //list all streams by recent isLive and updatedAt
    //if loggedin user, check if not blocked by streamer
    if (userId) {
      streams = await db.stream.findMany({
        where: {
          user: {
            NOT: {
              blocking: {
                some: {
                  blockedId: userId,
                }
              }
            }
          }
        },
        select: {
          id: true,
          user: true,
          isLive: true,
          name: true,
          thumbnailUrl: true,
        },
        orderBy: [
          {
            isLive: "desc",
          },
          {
            updatedAt: "desc",
          }
        ],
      });
    } else { //if no user, select all streams with recent isLive and updatedAt
      streams = await db.stream.findMany({
        select: {
          id: true,
          user: true,
          isLive: true,
          name: true,
          thumbnailUrl: true,
        },
        orderBy: [
          {
            isLive: "desc",
          },
          {
            updatedAt: "desc",
          }
        ]
      });
    }
  
    return streams;
};