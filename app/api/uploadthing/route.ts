import { createRouteHandler } from "uploadthing/next";
 
import { ourFileRouter } from "./core";
 
// Export routes for Next App Router - api route
export const { GET, POST } = createRouteHandler({
    router: ourFileRouter,
});