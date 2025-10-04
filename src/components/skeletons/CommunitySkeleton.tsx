export const CommunitySkeleton = () => {
  return (
    <div className="animate-pulse w-full h-[94px] flex justify-between items-center mx-auto py-2 lg:py-4 px-2 lg:px-7 rounded-xl lg:rounded-2xl space-y-4 p-4 border border-gray-400 shadow-2xs">
      <div className="flex flex-col items-start gap-4 mb-0">
        {/*  Name */}
        <div className="w-[150px] h-4 bg-gray-300 rounded"></div>
        {/* Description */}
        <div className="h-3 bg-gray-300 rounded w-[300px]"></div>
      </div>
      {/* Delete Button */}
      <div className="w-[70px] h-8 bg-gray-300 rounded  py-1"></div>
    </div>
  );
};
