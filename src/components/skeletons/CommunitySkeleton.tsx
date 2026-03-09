interface Props {
    count: number;
}

export const CommunitySkeleton = ({count}: Props) => {
 return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1120] to-[#0E1628] px-6 py-12">
        {/* ================= COMMUNITY CARDS ================= */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-${count} gap-8`}>

          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-3xl p-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/5 space-y-6"
            >
              {/* Title */}
              <div className="h-6 w-1/2 bg-[#1E293B] rounded" />

              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-[#1E293B] rounded" />
                <div className="h-4 w-5/6 bg-[#1E293B] rounded" />
              </div>

              {/* Members + Posts */}
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-[#1E293B] rounded" />
                <div className="h-4 w-20 bg-[#1E293B] rounded" />
              </div>

              {/* Button */}
              <div className="h-10 w-full rounded-full bg-gradient-to-r from-purple-500/40 to-blue-500/40" />
            </div>
          ))}

        </div>

      </div>
  );
};
