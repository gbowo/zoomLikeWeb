'use client'

import Image from "next/image"
import DateAndTime from "./DateAndTime"

const StatusBar = () => {
    return (
        <section className="flex flex-col gap-5 text-black items-center md:items-start">

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