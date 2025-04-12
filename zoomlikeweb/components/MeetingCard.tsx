'use client'

import { cn } from "@/lib/utils";
import { Call } from "@stream-io/video-react-sdk";
import Image from "next/image";
import Members from "./Members";
import { Button } from "./ui/button";
import { toast } from "sonner";

// 定义props类型
interface MeetingCardProps {
    title: string;
    date: string;
    icon: string;
    isPreviousMeeting?: boolean;
    buttonIcon1?: string;
    buttonText?: string;
    call: Call; // 从StreamSDK中导入Call对象
    type: string;
    handleClick: () => void; // 定义点击事件类型
    link: string; // 会议链接
}

// MeetingCard组件
const MeetingCard =({
    icon,
    title,
    date,
    isPreviousMeeting,
    buttonIcon1,
    handleClick,
    link,
    type,
    call,
    buttonText,
}: MeetingCardProps) => {
    return (
        // 展示会议卡片内的所有美容
        <section className="flex min-h-[258px] w-full flex-col justify-between rounded-3xl bg-blue-200 px-5 py8 xl:max-w-[568px] text-black scale-90 shadow-2xl">
            <article className="flex flex-col gap-5">
                {/* 展示会议 icon */}
                <Image src={icon} alt="upcoming" width={28} height={28} />
                <div className="flex justify-between">
                    <div className="flex flex-col gap-2">
                        {/* 会议标题和日期 */}
                        <h1 className="text-2xl font-bold">{title}</h1>
                        <p className="text-base font-normal">{date}</p>
                    </div>
                </div>
            </article>

            {/* 会议成员组件 */}
            <article className={cn("flex justify-center relative flex-col gap-3",{})}>
                <div>
                    {/* 展示会议成员当且仅当会议结束时 */}
                    {type === 'ended' && <Members call={call} />}
                </div>

                {/* 展示action按钮当且仅当会议未结束时 */}
                {!isPreviousMeeting && (
                    <div className="flex gap-5">
                        {/* 加入或开始一个会议的按钮 */}
                        <Button onClick={handleClick} className="rounded bg-blue-700 p-4 hover:bg-blue-400 px-6">
                            {buttonIcon1 &&(
                                <Image src={buttonIcon1} alt="feature" width={20} height={20} />
                            )}
                            {/* &nbsp表示添加一个空格在文本和按钮之间 */}
                            &nbsp; {buttonText}
                        </Button>

                        {/* 复制会议链接的按钮 */}
                        <Button 
                            className="bg-gray-700"
                            onClick={() => {
                                navigator.clipboard.writeText(link); // 复制文本到剪贴板
                                toast("Link copied to clipboard!",{
                                    duration: 3000,
                                    className: '!bg-gray-300 !rounded-3xl !py-8 !px-5 !justify-center'
                                });
                            }}
                        >
                            {/* copy icon */}
                            <Image src="/assets/copy.svg" alt="copy" width={20} height={20} />
                            &nbsp; Copy Link
                        </Button>
                    </div>
                )}
            </article>
        </section>
    );
};

export default MeetingCard;