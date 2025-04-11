'use client'

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const EndCallButton = () => {
    const router = useRouter();
    const call = useCall();
    if(!call){
        throw new Error("useStreamCall must be used within a StreamCall component.",);

    }
    const { useLocalParticipant } = useCallStateHooks();

    const localParticipant = useLocalParticipant();

    // 判断是否为会议拥有者
    const isMeetingOwner = localParticipant && call.state.createdBy && localParticipant.userId === call.state.createdBy.id;

    if(!isMeetingOwner) return null;

    // 会议结束后将用户重定向至首页
    const endCall = async () => {
        await call.endCall();
        router.push('/');
    }

    return (
        <Button onClick={endCall} className="bg-red-500">
            End call for everyone
        </Button>
    );

}

export default EndCallButton