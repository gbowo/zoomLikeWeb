'use client'
import Alert from "./Alert";
import {DeviceSettings, VideoPreview, useCall, useCallStateHooks} from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";

const MeetingSetup = ({
    setIsSetupComplete,
}: {
    setIsSetupComplete: (value: boolean) => void;
}) => {

    const {user} = useUser();
    if(!user) return;

    const call = useCall();
    if(!call) {
        throw new Error("useStreamCall must be used within StreamCall component.",);
    }

    const {useCallEndedAt, useCallStartsAt} = useCallStateHooks();
    const callStartsAt = useCallStartsAt();
    const callEndedAt = useCallEndedAt();
    const callTimeNotArrived = callStartsAt && new Date(callStartsAt) > new Date();
    const callHasEnded = !!callEndedAt; // !!转为相应boolean值
    const [isMicCamToggled, setIsMicCamToggled] = useState(false); // 初始状态用户允许打开麦克风和摄像头

    useEffect(() => {
        if(isMicCamToggled){
            call.camera.disable();
            call.microphone.disable();
        } else {
            call.camera.enable();
            call.microphone.enable();
        }
    },[isMicCamToggled,call.camera,call.microphone]);

    if(callTimeNotArrived)
        return (
            <Alert title={`Your meeting has not started yet. It is scheduled for ${callStartsAt.toLocaleString()}`} />
    );

    if(callHasEnded)
        return(
            <Alert title="Your meeting has ended ny the host."
                   iconUrl="/assets/call-ended.svg" />
    );

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-black">
            <h1 className="text-center text-2xl font-bold">Meeting Setup</h1>
            <VideoPreview />
            <div className="flex h-16 items-center jusify-center gap-3">
                <label className="flex items-center justify-center gap-2 font-medium">
                    <input type="checkbox" checked={isMicCamToggled} onChange={(e) => setIsMicCamToggled(e.target.checked)} />
                    Join with mic and camera off
                </label>
                <DeviceSettings />
            </div>
            <Button 
                className="rounded-3xl bg-blue-500 p-6 hover:bg-blue-800 hover:scale-125 transition ease-in-out delay-150 duration-300"
                onClick={() => {
                    call.join();
                    call.updateCallMembers({
                        update_members: [{ user_id: user.id}],
                    })

                    setIsSetupComplete(true);
                }}
            >
                Join Meeting
            </Button>
        </div>
    )
}

export default MeetingSetup;