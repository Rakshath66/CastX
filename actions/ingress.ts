"use server";

import {
    IngressAudioEncodingPreset,
    IngressInput,
    IngressClient,
    IngressVideoEncodingPreset,
    RoomServiceClient,
    type CreateIngressOptions,
} from "livekit-server-sdk";

import { TrackSource } from "livekit-server-sdk/dist/proto/livekit_models";

import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";
import { revalidatePath } from "next/cache";

// create room service - pass 3 env vars
const roomService = new RoomServiceClient(
    process.env.LIVEKIT_API_URL!,
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
)

//create ingress client
const ingressClient = new IngressClient(process.env.LIVEKIT_API_URL!);

// here ->  delete all rooms and active ingresses of me
export const resetIngresses = async (hostIdentity: string) => {
    // get all ingresses and rooms
    const ingresses = await ingressClient.listIngress({
        roomName: hostIdentity,
    });

    const rooms = await roomService.listRooms([hostIdentity]);

    // cannot use foreach or map because we cannot use await in it
    for (const room of rooms) {
        await roomService.deleteRoom(room.name);
    }

    for (const ingress of ingresses) {
        if (ingress.ingressId) { //proper active ingress
            await ingressClient.deleteIngress(ingress.ingressId);
        }
    }
}

//reset previous ingress and create ingress with options and ingresstype depending on input, then update the stream ket data, referesh paths
export const createIngress = async (ingressType: IngressInput) => {
    const self = await getSelf();

    // Everytime user create ingress, remove all the previous ingresses, rooms, active streams which this user has
    await resetIngresses(self.id);

    const options: CreateIngressOptions = {
        name: self.username,
        roomName: self.id, //anyone joining our room is joining our id(this is how we recognize where the user wants to join).
        participantName: self.username,
        participantIdentity: self.id,
    }
    
    //much more options depending on WHIP input or RTMP input
    if(ingressType === IngressInput.WHIP_INPUT) {
        options.bypassTranscoding = true;
    } else {
        options.video = {
            source: TrackSource.CAMERA,
            preset: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
        };
        options.audio = {
            source: TrackSource.MICROPHONE,
            preset: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
        }
    }

    //create ingress using options and ingresstype
    const ingress = await ingressClient.createIngress(
        ingressType,
        options,
    )

    if (!ingress || !ingress.url || !ingress.streamKey) {
        throw new Error("Failed to create ingress");
    }

    // for my stream(my id), update the data in db and refresh keys path
    await db.stream.update({
        where: { userId: self.id },
        data: {
            ingressId: ingress.ingressId,
            serverUrl: ingress.url,
            streamKey: ingress.streamKey,
        }
    })

    revalidatePath(`/u/${self.username}/keys`);
    return ingress;
}