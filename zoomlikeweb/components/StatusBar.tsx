'use client'

import Image from "next/image"
import DateAndTime from "./DateAndTime"
import { useGetCalls } from "@/hooks/useGetCalls";

const StatusBar = () => {

    // 从useGetCalls钩子中结构upcomingCalls属性
    const { upcomingCalls } = useGetCalls() || {upcomingCalls: []};

    // 找到最近的upcomingCall
    // 1. 过滤出有合法开始时间的calls
    // 2. 按开始时间排序，找到最早的会议
    // 3. 取出第一个元素，即最近的会议
    const nearestUpcomingCall = upcomingCalls
    ?.filter(call => call?.state?.startsAt)
    .sort((a,b) => new Date(a.state.startsAt!).getTime() - new Date(b.state.startsAt!).getTime())[0];

    // 提取最近会议的开始时间
    const startsAt = nearestUpcomingCall?.state?.startsAt;

    // 格式化开始时间为本地时间，若无最近会议则显示"No upcoming meetings
    const formattedDate = startsAt ? new Date(startsAt).toLocaleString() : "No upcoming meetings";

    // 如果没有最近会议，则渲染相应的文字和图片
    if(formattedDate == "No upcoming meetings"){
        return (
            <section className = "flex flex-col gap-5 text-black items-center md:items-start">
                {}
                <h2 className="bg-blue-100 max-w-[273px] rounded-2xl p-4 text-center text-base font-light">
                    No Upcoming Meetings
                </h2>
                {/* 渲染 DateAndTime 组件 */}
                <DateAndTime/>
                <Image src='/assets/home-image.svg' width={400} height={400} alt="home image" className="max-md:hidden -ml-16" />
            </section>
        )
    }


    return (
        <section className="flex flex-col gap-5 text-black items-center md:items-start">
            {/* 展示 upcoming meeting 时间 */}
            <h2 className="bg-blue-100 max-w-[273px] rounded-2xl p-4 text-center text-base font-light">
                Upcoming Meeting at:
                <p className="text-lg font-semibold text-gray-800">{formattedDate}</p>
            </h2>
            {/* 渲染 DateAndTime 组件 */}
            <DateAndTime/>
            {/* 显示 Home Page 图片 */}
            <Image
                src="/assets/home-image.svg"
                width={400}
                height={400}
                alt="home image"
                className="max-md:hidden -ml-16" // 当屏幕宽度<=md时隐藏该元素
                />
        </section>
    )
}

export default StatusBar