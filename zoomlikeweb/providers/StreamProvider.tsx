'use client'

import { tokenProvider } from "@/actions/stream.actions";
import Loading from "@/components/Loading";
import { useUser } from "@clerk/nextjs";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { ReactNode , useEffect, useState } from "react"

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamProvider = ({ children }: {children:
    ReactNode}) => {
        
        // 为视频客户端创建一个状态，类型为流式视频客户端类型
        const [videoClient,setVideoClient] = 
        useState<StreamVideoClient>();
        // 获取信息以及用户是否已加载
        const {user,isLoaded} = useUser();
        // 在挂载后运行，创建客户端
        useEffect(() => {
            if(!isLoaded || !user) return;
            if(!API_KEY) throw new Error("Stream API key not found");
            const client = new StreamVideoClient({
                apiKey: API_KEY,
                user:{
                    id: user?.id,
                    name: user.firstName || user?.username || 'User',
                    image: user?.imageUrl,
                },
                tokenProvider,
            });

            // 设置视频客户端
            setVideoClient(client);
            return () => {
                client.disconnectUser();
                setVideoClient(undefined);
            };
            // 每当用户更改或加载时发生更改
        }, [user,isLoaded])

        // 如果没有视频客户端则返回加载组件
        if(!videoClient) return <Loading />;

        // props中添加视频客户端
        return <StreamVideo client = {videoClient}>
            {/* 渲染子组件 */}
            {children}
        </StreamVideo>
}

export default StreamProvider;