'use client'

import { useEffect, useState } from "react";

const DateAndTime = () => {

    const [time, setTime] = useState(()=>{
        const now = new Date();
        return now.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
    });

    const [date, setDate] = useState(()=>{
        const now = new Date();
        return now.toLocaleDateString('en-US', {dateStyle: 'full'});
    });

    // 每秒更新日期和时间，使用js内置函数
    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}));
            setDate(now.toLocaleDateString('en-US', {dateStyle: 'full'}));
        }, 1000);
        return () => clearInterval(intervalId); // 清除定时器
    }, []); // 仅在首次渲染时执行，在组建挂载后运行(这里将空数组作为useEffect的第二个参数)

    return (
        <div className="flex flex-col gap-5">
            <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
        </div>
    )
}

export default DateAndTime