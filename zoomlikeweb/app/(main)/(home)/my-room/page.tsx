'use client'

import PersonalMeetingInfo from "@/components/PersonalMeetingInfo";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const MyRoomPage = () => {

    const {user} = useUser();
    const client = useStreamVideoClient();
    const router = useRouter();;

    // 设置会议ID为当前用户ID
    const meetingId = user?.id;

    // 开始个人会议房间
    const startRoom = async () => {
        // 确保客户端和用户存在
        if(!client || !user) return;

        // 使用用户ID创建一个新的会议实例
        const personalCall = client.call("default",meetingId!);
        await personalCall.getOrCreate({
            data: {
                starts_at: new Date().toISOString(),
            },
        });

        // 跳转到会议房间页面
        router.push(`/meeting/${meetingId}`);
    };

    // 生成会议邀请链接
    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}`;


    return (
        <section className="flex size-full flex-col gap-10 text-white animate-fade-in">
            <h1 className="text-xl font-bold lg:text-3xl">
                Personal Meeting Room
            </h1>

            {/* 会议细节 */}
            <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
                <PersonalMeetingInfo title="Topic" description={`${user?.firstName || user?.username || 'No Name Found'}'s Meeting Room`} />
                <PersonalMeetingInfo title="Meeting ID" description={meetingId!} />
                <PersonalMeetingInfo title="Invite Link" description={meetingLink} /> 
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-5">
                {/* 开始会议按钮 */}
                <Button className="rounded bg-blue-700 p-4 hover-button px-6" onClick={startRoom}>
                    Start Meeting
                </Button>

                {/* 复制会议链接按钮 */}
                <Button className="bg-gray-700 hover-button"
                    onClick={() => {
                        navigator.clipboard.writeText(meetingLink);
                        toast("Copied to clipboard", {
                            duration: 3000,
                            className: '!bg-gray-300 !rounded-3xl !py-8 !px-5 !justify-center'
                        });
                    }}
                >
                    {/* Copy Icon */}
                    <Image src="/assets/copy.svg" alt="copy" width={20} height={20} />
                    Copy Invitation
                </Button>
            </div>
        </section>
    );
};

export default MyRoomPage;