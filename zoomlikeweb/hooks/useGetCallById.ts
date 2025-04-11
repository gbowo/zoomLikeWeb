'use client'

import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCallById = (id: string | string []) => {
    const [call, setCall] = useState<Call>();
    // 开始时call将处于加载状态
    const [isCallLoading, setIsCallLoading] = useState(true);
    // 创建视频流客户端
    const client = useStreamVideoClient();

    // 在客户端或ID发生变化时运行
    useEffect(() => {
        if (!client) return;
        const loadCall = async () => {
            try {
                const { calls } = await client.queryCalls({
                    filter_conditions: { id } // 筛选条件为ID
                });
                if(calls.length > 0) setCall(calls[0]);
                setIsCallLoading(false);
            }catch(error:any){
                console.error(error);
                setIsCallLoading(false);
            }
        }
        loadCall();
    },[client, id])
    return { call, isCallLoading };

}