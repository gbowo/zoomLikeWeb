'use client'

import { useGetCalls } from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import Alert from "./Alert";
import { useRouter } from "next/navigation";
import MeetingCard from "./MeetingCard";

const CallList = ({type}: {type: 'ended' | 'upcoming' | 'recordings'}) =>{
    const router = useRouter();
    // 使用useGetCalls钩子解构
    const {endedCalls,upcomingCalls,callRecordings,isLoading} = useGetCalls();
    const [recordings,setRecordings] = useState<CallRecording[]>([]); // 定义一个空数组，用于存储录制的会议

    // 根据type类型，渲染不同的会议列表
    const getCalls = () => {
        switch (type) {
            case 'ended':
                return endedCalls;
            case 'upcoming':
                return upcomingCalls;
            case'recordings':
                return recordings;
            default:
                return []; // 返回空数组
        }
    };

    // 监听会议的录制状态，并将录制的会议加入到recordings数组中
    useEffect(() => {
        const fetchRecordings = async () => {
            const callData = await Promise.all(
                callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [], // 为每个会议查询录制
            );

            // 过滤空录音，调用flatmap方法将多个会议的录音合并到一个数组中
            const recordings = callData
                .filter((call) => call.recordings.length > 0)
                .flatMap((call) => call.recordings);
            
            setRecordings(recordings); // 更新recordings数组
        };

        if (type ==='recordings') {
            fetchRecordings();
        }
    },[type,callRecordings]) // 当类型或录制会议改变时，重新渲染

    if(isLoading) return <Loading />;

    // 根据type类型，渲染不同的会议列表
    const calls = getCalls();

    // 当会议存在时渲染MeetingCards
    if(calls && calls.length > 0) return (
        // 会议设置成网格布局，每行显示3个
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            {
                calls.map((meeting: Call | CallRecording) => {
                    // 使用filename作为录制会议的唯一标识，url作为备选
                    const meetingKey = type === 'recordings' 
                    ? (meeting as CallRecording).filename || (meeting as CallRecording).url 
                    : (meeting as Call).id;
                    return (
                        <MeetingCard
                            call = {meeting as Call} // 类型断言，将会议类型转换为Call类型
                            key =  {meetingKey}  // 使用动态生成的key
                            type = {type} // 传递会议类型，用于渲染不同的会议列表
                            icon = {
                                type === 'ended'
                                    ? '/assets/previous.svg'
                                    : type ==='recordings'
                                    ? '/assets/recordings2.svg'
                                    : '/assets/upcoming.svg'
                            }
                            title = {
                                (meeting as Call).state?.custom?.description ||  // 自定义会议标题
                                (meeting as CallRecording).filename?.substring(0,20) || // 使用会议文件名
                                'No Description' // 默认标题
                            }
                            date = {
                                (meeting as Call).state?.startsAt?.toLocaleString() || // 自定义会议日期
                                (meeting as CallRecording).start_time?.toLocaleString() // 使用录制日期
                            }
                            isPreviousMeeting={type==='ended'} // 标记是否是之前的会议，用于显示不同的图标
                            link={
                                type === 'recordings'
                                   ? (meeting as CallRecording).url // 录制会议的下载链接
                                    : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`// 正在进行的会议的加入链接
                            }
                            buttonIcon1={type === 'recordings' ? '/assets/play.svg' : undefined} // 播放图标
                            buttonText={type === 'recordings' ? 'Play' : 'Start'} // 使用Play开始播放，否则使用Start图标
                            handleClick={
                                type ==='recordings'
                                   ? () => router.push(`${(meeting as CallRecording).url}`) // 跳转到录制会议的URL
                                   : () => router.push(`/meeting/${(meeting as Call).id}`) // 跳转到正在进行的会议的加入链接
                            }
                        />
                    )
                })
            }
        </div>
    );

    // 如果没有会议存在，就显示一条Alert信息
    return (
        <Alert
            title='No calls available'
            iconUrl='/assets/no-calls.svg'
        />
    );

}

export default CallList;