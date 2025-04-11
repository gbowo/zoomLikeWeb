'use client'

import Alert from "@/components/Alert";
import Loading from "@/components/Loading";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import { useState } from "react";

const MeetingPage = () => {
    const { id } = useParams<{ id: string }>();
    if(!id) return;
    const {isLoaded, user} = useUser();
    const {call,isCallLoading} = useGetCallById(id);
    const [isSetupComplete, setIsSetupComplete] = useState(false); // 一开始设为false，等用户设置完成后再改为true

    // 用户未加载或调用仍处于加载中时，返回加载组件
    if (!isLoaded || isCallLoading) return <Loading />;

    if(!call) return (
        <p className="text-center text-3xl font-bold text-white">
            Call Not Found
        </p>
    )

    // 确认用户是否用权限进入会议(被邀请和在通话成员中的才有权限进入)
    const notAllowed = call.type === 'invited' && (!user || !call.state.members.find((m) => m.user.id === user.id));
    if(notAllowed) return <Alert title="You are not allowed to join this meeting." />

    return (
        <main className="h-screen w-full">
            <StreamCall call={call}>
                <StreamTheme>
                    {/* 检查设置是否完成 */}
                    {!isSetupComplete ? (
                        <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
                    ) : (
                        <MeetingRoom />
                    )}
                </StreamTheme>
            </StreamCall>
        </main>
    )
}   

export default MeetingPage;