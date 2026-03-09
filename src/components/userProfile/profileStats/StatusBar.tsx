import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../supabase-client";
import type { ProfileStats } from "../../../Interfaces";

const getProfileStats = async (profileId: string): Promise<ProfileStats> => {
  const { data, error } = await supabase.rpc("get_profile_stats", {
    proid: profileId,
  });

  if (error) throw new Error(error.message);
  return data;
};

export const StatsBar = ({ profileId }: { profileId: string }) => {
  const { data, error, isLoading } = useQuery<
    ProfileStats | null,
    Error
  >({
    queryKey: ["profilestats", profileId],
    queryFn: () => getProfileStats(profileId),
  });

  if (error) {
    return (
      <div className="flex justify-center items-center text-gray-400">
        Something went wrong. Try refreshing.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const stats = [
    { label: "Posts", value: data?.postsCount },
    { label: "Followers", value: data?.followersCount },
    { label: "Following", value: data?.followingCount },
    { label: "Communities", value: data?.communitiesCount },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative p-[1px] rounded-2xl 
                     bg-gradient-to-br from-purple-500 to-blue-500 
                     shadow-[0_0_25px_rgba(139,92,246,0.25)]"
        >
          <div
            className="bg-[#0b1120] backdrop-blur-xl 
                       rounded-2xl h-28 flex flex-col 
                       items-center justify-center text-center"
          >
            <div className="text-2xl font-bold text-purple-400">
              {stat.value ?? 0}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};