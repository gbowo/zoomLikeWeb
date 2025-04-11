'use client'

import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog"
import MenuItemCard from "./MenuItemCard"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "./ui/dialog"
import { Textarea } from "./ui/textarea"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import DatePicker from "react-datepicker"
import { useUser } from "@clerk/nextjs"
import Loading from "./Loading"
import { useStreamVideoClient } from "@stream-io/video-react-sdk"
import { toast } from "sonner"

const initialValues = {
    dateTime:new Date(),
    description: '',
    link: ''
};

const MainMenu = () => {
    const {user} = useUser(); // 对象解构：从user中提取属性并将其赋值给变量
    const router = useRouter();
    const [values, setValues] = useState(initialValues);
    const [meetingState, setMeetingState] = useState<'Schedule' | 'Instant' | undefined>(undefined);
    const client = useStreamVideoClient();

    const createMeeting = async() => {
        if(!user) return router.push('/login');
        // 如果没有客户端则返回首页
        if(!client) return router.push('/');

        try {
            if(!values.dateTime){
                toast('Please select a date and time', {
                    duration: 3000,
                    className: 'bg-gray-300 rounded-3xl py-8 px-5 justify-center'
                });
                return;
            }

            // 使用crypto生成随机id
            const id = crypto.randomUUID();
            const call = client.call('default',id);
            if(!call) throw new Error('Failed to create meeting');
            // 如果不存在就创建一个新日期
            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.description || 'No description';
            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom:{
                        description,
                    },
                },
            });

            // 更新通话成员
            await call.updateCallMembers({
                update_members: [{ user_id: user.id}],
            })

            // 如果是立即会议则直接进入会议页面
            if(meetingState === 'Instant'){
                router.push(`/meeting/${call.id}`);
                toast('Setting up your meeting',{
                    duration: 3000,
                    className: '!bg-gray-300 !rounded-3xl !py-8 !px-5 !justify-center'
                });
            }

            // 如果是计划会议则跳转至upcoming页面
            if(meetingState === 'Schedule'){
                router.push('/upcoming')
                toast(`Your meeting is scheduled at ${values.dateTime}`,{
                    duration: 5000,
                    className: '!bg-gray-300 !rounded-3xl !py-8 !px-5 !justify-center'
                });
            }

        } catch(err:any) {
            toast(`Failed to create meeting ${err.message}`, {
                duration: 3000,
                className: '!ng-gray-300 !rounded-3xl !py-8 !px-5 !justify-center',
            })
        }
    }

    // 如果meetingState发生变化则调用createMeeting
    useEffect(() => {
        if(meetingState) {
            createMeeting();
        }
    },[meetingState])

    if(!client || !user) return <Loading />;

    return (
        // 创建首页四个方块
        <section className="grid grid-cols-2 gap-3 ma-sm:grid-cols-1">
            {/* 创建会议 */}
            <Dialog>
                <DialogTrigger>
                    <MenuItemCard
                        bgColor="#f97316"
                        hoverColor="#9a3412"
                        img="/assets/new-meeting.svg"
                        title="New Meeting"
                    />
                </DialogTrigger>
                <DialogContent className="bg-gray-200 px-16 py-10 text-gray-900 !rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black leading-relaxed text-center">
                            Start an Instant Meeting
                        </DialogTitle>
                        <DialogDescription className="flex flex-col items-center">
                            Add a meeting description
                            <Textarea className="inputs p-5" rows={4} onChange={(e) => 
                            setValues({...values, description: e.target.value})} 
                            />

                            <Button className="mt-5 font-extrabold text-lg text-white rounded-xl bg-blue-700 py-5 px-10 hover-button"
                            onClick={() => setMeetingState('Instant')}
                            >
                                Create Meeting
                            </Button>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            
            {/* 加入会议 */}

            <Dialog>
                <DialogTrigger>
                    <MenuItemCard
                        bgColor="#2563eb"
                        hoverColor="#1e40af"
                        img="/assets/join-meeting.svg"
                        title="Join a Meeting"
                    />
                </DialogTrigger>
                <DialogContent className="bg-gray-200 px-16 py-10 text-gray-900 rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black leading-relaxed text-center mb-5">
                            Type the Meeting link here
                        </DialogTitle>
                        <DialogDescription className="flex flex-col gap-3 items-center">
                            <Input 
                                type='text'
                                placeholder='Meeting Link'
                                className='inputs'
                                onChange={(e) => setValues({...values, link: e.target.value})}
                            />


                            <Button className="mt-5 font-extrabold text-lg text-white rounded-xl bg-blue-700 py-5 px-10 hover-button"
                            onClick={() => router.push(values.link)}
                            >
                                Join Meeting
                            </Button>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

              {/* 预订会议  */}

            <Dialog>
                <DialogTrigger>
                    <MenuItemCard
                        bgColor="#2563eb"
                        hoverColor="#1e40af"
                        img="/assets/calendar.svg"
                        title="Schedule"
                    />
                </DialogTrigger>
                <DialogContent className="bg-gray-200 px-16 py-10 text-gray-900 !rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black leading-relaxed text-center mb-5">
                            Schedule Meeting
                        </DialogTitle>
                        <DialogDescription className="flex flex-col gap-3">
                            
                            Add a meeting description

                            <Textarea className="inputs p-5" rows={4} 
                            onChange={(e) => 
                              setValues({...values, description: e.target.value})
                            }
                            />
                        </DialogDescription>
                        <div className="flex w-full flex-col gap-2.5">
                            <label className="text-base font-normal leading-[22.4px] text-sky-2">
                            Select Date and Time
                            </label>
                            <DatePicker
                                preventOpenOnFocus
                                selected={values.dateTime}
                                onChange={(date) => setValues({ ...values, dateTime: date! })}
                                showTimeSelect
                                timeIntervals={15}
                                timeCaption="time"
                                dateFormat="MMMM d, yyyy h:mm aa"
                                className="inputs w-full rounded p-2 focus:outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-200  "
                            />
                        </div>
                        <Button className='!mt-5 font-extrabold text-lg text-white rounded-xl bg-blue-700 py-5 px-10 hover-button'
                        onClick={() => setMeetingState('Schedule')}
                        >
                        Submit
                        </Button>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            {/* 简单的recording方块，用于后面定位至recordings页面 */}
            <MenuItemCard
                bgColor="#2563eb"
                hoverColor="#1e40af"
                img="/assets/recordings2.svg"
                title="Recordings"
                handleClick={() => router.push('/recordings')}
                />
        </section>
    )
}

export default MainMenu;