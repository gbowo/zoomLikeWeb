'use client'

import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCalls = () => {
    const {user} = useUser();
    const client = useStreamVideoClient();
    const [calls,setCalls] = useState<Call[]>();
    const [isLoading,setIsLoading] = useState(false);

    useEffect(() => {
        const loadCalls = async () => {
            if(!client ||!user?.id) return;

            setIsLoading(true);

            try {
                const {calls} = await client.queryCalls({
                    // 根据会议开始时间排序，倒叙
                    sort: [{field:'starts_at',direction: -1}],
                    filter_conditions: {
                        // 指定开始时间必须存在
                        starts_at: {$exists: true},
                        $or: [
                            // 当前用户为主持人或会议成员
                            {created_by_user_id: user.id},
                            {members: {$in: [user.id]}},
                        ],
                    },
                });

                setCalls(calls);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        loadCalls();
        // 当 client 或 user 变化时，重新加载会议列表
    },[client,user?.id])

    const now = new Date();

    // endedCalls 用于存储当前已经开始的会议并且有个结束的时间戳表示这次会议已经结束
    const endedCalls = calls?.filter(({state: {startsAt,endedAt}}: Call)=>{
        return (startsAt && new Date(startsAt) < now) || !!endedAt;
    })

    // upcomingCalls yfilter 用于存储当前还未开始的会议
    const upcomingCalls = calls?.filter(({state: {startsAt}}: Call)=>{
        return startsAt && new Date(startsAt) > now;
    })

    // 对这些会议进行重命名后返回会议的全部类型
    return {endedCalls,upcomingCalls,callRecordings: calls,isLoading}
}