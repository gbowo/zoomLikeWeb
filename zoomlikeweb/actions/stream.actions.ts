// 服务器组件，后端逻辑
'use server'

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const streamApiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const streamSecretKey = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
    const user = await currentUser();
    if(!user) throw new Error("User not authenticated");
    if(!streamApiKey) throw new Error("Stream API key not set");
    if(!streamSecretKey) throw new Error("Stream secret key not set");

    const client = new StreamClient(streamApiKey,streamSecretKey);
    const userId: string = user.id;

    // token有效期为1小时
    const validity = 60*60;
    // token生成信息
    const token = client.generateUserToken(
        {
            user_id: userId,
            validity_in_seconds: validity
        }
    );
    return token as string;
}