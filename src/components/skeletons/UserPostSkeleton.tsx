export const UserPostSkeleton = () => {
    return (
        <div className="animate-pulse flex flex-col gap-2 w-full p-4 border border-gray-300 rounded-[10px] shadow-sm">
            {/* Title */}
            <div className="ml-3 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/6"></div>
            </div>
            {/* description */}
            <div className="ml-3 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-2/6"></div>
            </div>
        </div>
    );
};