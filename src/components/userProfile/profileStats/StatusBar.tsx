import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../supabase-client";
import type { ProfileStats } from "../../../Interfaces";

const getProfileStats = async(profileId: string) : Promise<ProfileStats> => {
  const { data, error } = await supabase.rpc("get_profile_stats", { proid: profileId });

  if (error) throw new Error(error.message);
  return data;
}

export const StatsBar = ({profileId}: {profileId: string}) => {
  const { data, error } = useQuery<ProfileStats | null, Error>({
    queryKey: ["profilestats", profileId],
    queryFn: () => getProfileStats(profileId),
  });
  if(error){
    return (
      <div className="flex justify-center items-center">
        <p>Something went wrong. try to refresh the page</p>
      </div>
    );
  }
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="grid grid-cols-4 text-center">
          <div>
            <div className="text-lg font-semibold">{data?.postsCount}</div>
            <div className="text-sm text-gray-500">Posts</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{data?.followersCount}</div>
            <div className="text-sm text-gray-500">Followers</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{data?.followingCount}</div>
            <div className="text-sm text-gray-500">Following</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{data?.communitiesCount}</div>
            <div className="text-sm text-gray-500">Communities</div>
          </div>
        </div>
      </div>
    );
  }