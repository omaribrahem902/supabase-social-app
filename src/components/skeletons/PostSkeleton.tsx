export const PostSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col gap-2 w-80 p-4 
                    border border-white/10 
                    bg-[#111C2D] 
                    rounded-[20px] shadow-md">

      <div className="flex items-center space-x-2">
        {/* Avatar */}
        <div className="w-9 h-9 bg-[#1E293B] rounded-full"></div>

        {/* Name */}
        <div className="h-3 bg-[#1E293B] rounded w-2/4"></div>
      </div>

      {/* Title */}
      <div className="ml-3 space-y-2">
        <div className="h-4 bg-[#1E293B] rounded w-4/6"></div>
      </div>

      {/* Image */}
      <div className="w-full h-[185px] bg-[#1E293B] rounded-[20px]"></div>

      {/* Likes and Comments */}
      <div className="flex justify-around items-center">
        <span className="h-10 w-[50px] bg-[#1E293B] rounded-lg"></span>
        <span className="h-10 w-[50px] bg-[#1E293B] rounded-lg"></span>
      </div>

    </div>
  );
};