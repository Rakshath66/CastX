"use client";

//online, offline or loading
//hooks for current status of the stream
import { ConnectionState, Track } from "livekit-client";
import {
   useConnectionState,
   useRemoteParticipant,
   useTracks,
} from "@livekit/components-react"
import { OfflineVideo } from "./offline-video";
import { LoadingVideo } from "./loading-video";
import { LiveVideo } from "./live-video";

interface VideoProps {
    hostName: string;
    hostIdentity: string;
}

//connection, participant and their tracks connected
export const Video = ({
   hostName,
   hostIdentity,
}: VideoProps) => {
   const connectionState = useConnectionState();
   const participant = useRemoteParticipant(hostIdentity);
   const tracks = useTracks([
      Track.Source.Camera,
      Track.Source.Microphone,
   ]).filter((track) => track.participant.identity === hostIdentity);

   let content;

   //if no participant and connected, no participant or no tracks, else
   if(!participant && connectionState === ConnectionState.Connected) {
      content = <OfflineVideo username={hostName} />;
   } else if (!participant || tracks.length === 0) {
      content = <LoadingVideo label={connectionState} />;
   } else {
      content = <LiveVideo participant={participant} />;
   }

  return (
     <div className="aspect-video border-b group relative">
        {content}
     </div>
  );
};