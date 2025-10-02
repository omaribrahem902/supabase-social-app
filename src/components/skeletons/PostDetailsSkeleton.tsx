export const PostDetailsSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col gap-4 mt-5 p-4 border border-gray-300 rounded shadow-sm">
      {/* Title */}
      <div className="flex justify-center items-center ml-3">
        <div className="w-[400px] h-10 bg-gray-300 rounded"></div>
      </div>
      {/* Image */}
      <div className="rounded object-cover w-full h-64 lg:h-[500px] bg-gray-300"></div>
    </div>
  );
};
