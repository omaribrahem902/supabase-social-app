export const PostDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#0B1120] text-white px-4 lg:px-10 py-10 animate-pulse">
      
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ================= HERO SECTION ================= */}
        <div className="relative rounded-xl overflow-hidden">

          {/* Image Skeleton */}
          <div className="w-full h-64 lg:h-[500px] bg-[#1E293B]" />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/10 to-transparent" />

          {/* User Info Card Skeleton */}
          <div className="absolute bottom-4 left-2 lg:bottom-6 lg:left-6 
                          bg-white/10 backdrop-blur-xl 
                          border border-white/20 
                          rounded-lg lg:rounded-2xl 
                          px-2 lg:px-5 py-2 lg:py-3 
                          flex items-center gap-3 shadow-xl">

            {/* Avatar */}
            <div className="lg:w-10 w-8 lg:h-10 h-8 rounded-full bg-[#1E293B]" />

            <div className="space-y-2">
              {/* Username */}
              <div className="h-3 lg:h-4 w-24 bg-[#1E293B] rounded" />
              
              {/* Date */}
              <div className="h-2 lg:h-3 w-32 bg-[#1E293B] rounded" />
            </div>
          </div>
        </div>

        {/* ================= TITLE ================= */}
        <div className="space-y-3">
          <div className="h-6 lg:h-8 w-3/4 bg-[#1E293B] rounded" />
          <div className="h-6 lg:h-8 w-1/2 bg-[#1E293B] rounded" />
        </div>

      </div>
    </div>
  );
};