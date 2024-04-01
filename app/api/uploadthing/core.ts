import { createUploadthing, type FileRouter } from "uploadthing/next";

import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";
 
const f = createUploadthing();
 
// FileRouter for your app, can contain multiple FileRoutes with a unique routeSlug for each
// routeSlug - middleware - set permission and file types, thow errors, onuploadcomplete- get metadata after upload, runs on server returns data to client
export const ourFileRouter = {
    thumbnailUploader: f({  //Filerouter
        image: { 
          maxFileSize: "4MB", 
          maxFileCount: 1 
        } 
      })
        .middleware(async () => { //send
          const self = await getSelf();
    
          return { user: self }
        })
        .onUploadComplete(async ({ metadata, file }) => { //recieve runs return to client
          await db.stream.update({ //update stream with url
            where: {
              userId: metadata.user.id, //doesn't wait until user specifies, immediately stores in db -> reduce no of uploads
            },
            data: {
              thumbnailUrl: file.url,
            },
          });
    
          return { fileUrl: file.url };
        })
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;