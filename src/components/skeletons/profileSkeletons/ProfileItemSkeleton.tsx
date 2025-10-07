export const ProfileItemSkeleton = () => {
  return (
    <div className="animate-pulse flex items-center gap-2 w-full">
      {/* avatar */}
      <div className="min-h-10 min-w-10 rounded-full bg-gray-300"></div>
      <div className="flex w-full flex-col gap-2">
        {/* name */}
        <div className="h-2 bg-gray-300 rounded w-1/6"></div>
        {/* bio */}
        <div className="h-2 bg-gray-300 rounded w-2/6"></div>
      </div>
    </div>
  );
};
