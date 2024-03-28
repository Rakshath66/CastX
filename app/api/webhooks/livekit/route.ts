import { headers } from "next/headers";
import { WebhookReceiver } from "livekit-server-sdk";

import { db } from "@/lib/db";

// receiver recieves these
const receiver = new WebhookReceiver(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
)

//if he is logged in user, check ingress started by him or not, based on that update db.
export async function POST(req: Request) {
    //get these things from req
    const body = await req.text();
    const headerPayload = headers();
    const authorization = headerPayload.get("Authorization");

    if(!authorization) {
        return new Response("No authorization header", { status: 400 })
    }

    //livekit has access to webhook, recieve event
    const event = receiver.receive(body, authorization);

    //which event was fired?
    if(event.event === "ingress_started") {
        await db.stream.update({
            where: {
                ingressId: event.ingressInfo?.ingressId,
            },
            data: {
                isLive: true,
            }
        })
    }

    if(event.event === "ingress_ended") {
        await db.stream.update({
            where: {
                ingressId: event.ingressInfo?.ingressId,
            },
            data: {
                isLive: false,
            }
        })
    }
}