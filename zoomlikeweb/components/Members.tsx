'use client'

import { cn } from "@/lib/utils";
import { Call } from "@stream-io/video-react-sdk";
import Image from "next/image";
import { useEffect, useState } from "react";

// 组件props接口
type MembersProps = {
    call: Call
}

const Members = ({call}: MembersProps) => {
    if(!call) return; // 如果没有call对象，则不渲染组件

    const [callMembers,setCallMembers] = useState<any[]>([]) // 存储call中所有成员的列表

    // 监听call中成员列表的变化
    useEffect(() => {
        const getMembers = async () => {
            const members = await call.queryMembers(); // 获取call中所有成员
            setCallMembers(members.members); // 更新成员列表
        }
        getMembers();
    },[])// 每当call对象变化时，重新获取成员列表

    // 如果有成员在会议中则渲染出他们的头像
    if(callMembers.length > 0){
        return (
            <div className="relative flex w-full">
                {callMembers.map((member,index) => {
                    const user = member.user // 提取成员的user对象
                    return (
                        <Image
                            key={user.id} // 为每一个成员的头像设置一个key
                            src={user.image}
                            alt="attendees"
                            width={40}
                            height={40}
                            className={cn("rounded-full",{absolute: index > 0})} // 第一个头像是静态的，其他头像是绝对定位的
                            style={{top: 0, left: index * 28}} // 动态设置头像的位置
                        />
                    )
                })}

                {/* 显示会议成员的总数 */}
                <div className="flex justify-center items-center absolute left-[136px] size-10 rounded-full border-[5px] border-gray-800 bg-gray-800 text-white shadow-2xl">
                    {callMembers.length}
                </div>
            </div>
        )
    }
}

export default Members;