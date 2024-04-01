import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";

export const getSearch = async (term?: string) => {
    let userId;
  
    //loggedin user(check not blocked by host user) and guest users
    try {
      const self = await getSelf();
      userId = self.id;
    } catch {
      userId = null;
    }

    let streams = [];

    // if stream name or user name contains the search term, return those streams
    if (userId) {
        streams = await db.stream.findMany({
          where: {
            user: {
              NOT: {
                blocking: {
                  some: {
                    blockedId: userId,
                  },
                },
              },
            },
            OR: [
              {
                name: {
                  contains: term,
                },
              },
              {
                user: {
                  username: {
                    contains: term,
                  },
                }
              },
            ],
          },
          // include: {
          //   user: true,
          // },
          select: {
            user: true,
            id: true,
            name: true,
            isLive: true,
            thumbnailUrl: true,
            updatedAt: true,
          },
          orderBy: [
            {
              isLive: "desc",
            },
            {
              updatedAt: "desc",
            },
          ],
        });
      } else {
        streams = await db.stream.findMany({
          where: {
            OR: [
              {
                name: {
                  contains: term,
                },
              },
              {
                user: {
                  username: {
                    contains: term,
                  },
                }
              },
            ],
          },
          select: {
            user: true,
            id: true,
            name: true,
            isLive: true,
            thumbnailUrl: true,
            updatedAt: true,
          },
          orderBy: [
            {
              isLive: "desc",
            },
            {
              updatedAt: "desc",
            },
          ],
        });
    };

    return streams;
};