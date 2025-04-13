'use client'

const PersonalMeetingInfo = ({title,description} : {title: string, description: string}) => {
    return (
        <div className="flex flex-col items0start gap-2 xl:flex-row text-black">
             {/* 标题 */}
             <h1 className="text-base font-medium text-sky-1 lg:text-xl xl:min-w-32">
                {title}:
             </h1>
             <h1 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">
                {description}
             </h1>
        </div>
    );
};

export default PersonalMeetingInfo;