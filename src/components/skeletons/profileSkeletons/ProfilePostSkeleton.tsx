export const ProfilePostSkeleton = () => {
    return (
        <div className="h-[130px] bg-[#0B1120] animate-pulse flex justify-start w-full p-4 border border-gray-600 rounded-[10px] shadow-sm">
            {/* Title */}
            <div className="bg-black ml-3 space-y-2">
                <div className="h-4 bg-[#0B1120] rounded w-1/6"></div>
            </div>
            {/* description */}
            <div className="bg-black ml-3 space-y-2">
                <div className="h-4 bg-[#0B1120] rounded w-2/6"></div>
            </div>
        </div>
    );
};