"use client";

import { useEffect, useRef, useState } from "react";
import { Participant, Track } from "livekit-client";
import { useTracks } from "@livekit/components-react";
import { FullscreenControl } from "./fullscreen-control";
import { useEventListener } from "usehooks-ts";
import { VolumeControl } from "./volume-control";

interface LiveVideoProps {
    participant: Participant;
}

export const LiveVideo = ({
    participant,
}: LiveVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(0);

  //change both state and actual video element
  //inc volume - change muted(boolean) and volume(number inc)
  const onVolumeChange = (value: number) => {
    setVolume(+value);
    if (videoRef?.current) {
      videoRef.current.muted = value === 0; //muted or not on change
      videoRef.current.volume = +value * 0.01; //value
    }
  }

  //if muted set 50, else 0
  const toggleMute = () => {
    const isMuted = volume === 0;

    setVolume(isMuted ? 50 : 0);

    if (videoRef?.current) {
      videoRef.current.muted = !isMuted; //opposite of current value on toggle
      videoRef.current.volume = isMuted ? 0.5 : 0;
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen()
      // setIsFullscreen(false); //doesn't work with esc
    } else if (wrapperRef?.current) {
      wrapperRef.current.requestFullscreen()
      // setIsFullscreen(true);
    }
  }


  //on load, volume is muted, fire videoRef
  useEffect(() => {
      onVolumeChange(0)
  }, []);

  //ideal solution - for esc and min-max
  const handleFullscreenChange = () => {
    const isCurrentlyFullscreen = document.fullscreenElement != null;
    setIsFullscreen(isCurrentlyFullscreen);
  }

  useEventListener("fullscreenchange", handleFullscreenChange, wrapperRef);

  //if participant is me, show camera and microphone
  useTracks([Track.Source.Camera, Track.Source.Microphone])
    .filter((track) => track.participant.identity === participant.identity)
    .forEach((track) => {
      if (videoRef.current) {
        track.publication.track?.attach(videoRef.current)
      }
    });

  return (
     <div
       ref={wrapperRef}
       className="relative h-full flex"
     >
        <video ref={videoRef} width="100%" />

        <div className="absolute top-0 h-full w-full opacity-0 hover:opacity-100 hover:transition-all">
          <div className="absolute bottom-0 flex h-14 w-full items-center justify-between bg-gradient-to-r from-neutral-900 px-4">
            <VolumeControl 
              onChange={onVolumeChange}
              value={volume}
              onToggle={toggleMute}
            />
            <FullscreenControl
              isFullscreen={isFullscreen}
              onToggle={toggleFullscreen}
            />
          </div>
        </div>
     </div>
  );
};