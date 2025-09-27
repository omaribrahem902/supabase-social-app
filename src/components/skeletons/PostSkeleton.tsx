export const SkeletonLoader = () => {
        return (
            <div className="animate-pulse flex flex-col gap-2 w-80 p-4 border border-gray-300 rounded-[20px] shadow-sm">
                <div className="flex items-center space-x-2">
                    {/*  Avatar */}
                    <div className="w-9 h-9 bg-gray-300 rounded-full"></div>
                    {/* Name */}
                    <div className="h-3 bg-gray-300 rounded w-2/4"></div>
                </div>
        
                {/* Title */}
                <div className="ml-3 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                </div>
                {/* Image */}
                <div className="w-full h-[185px] bg-gray-300 rounded-[20px]"></div>
                {/* Likes and Comments */}
                <div className="flex justify-around items-center">
                    <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg">
                        ❤️ <span className="ml-2">0</span>
                    </span>
                    <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg">
                        💬 <span className="ml-2">0</span>
                    </span>
                </div>
            </div>
        );
};
  