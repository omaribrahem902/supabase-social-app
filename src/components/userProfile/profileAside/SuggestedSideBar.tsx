import { useQuery} from "@tanstack/react-query";
import { SuggestedItem } from "./SuggestedItem";
import type { Profile } from "../../../Interfaces";
import { supabase } from "../../../supabase-client";
import { SuggestedProfilesSkeleton } from "../../skeletons/profileSkeletons/SuggestedProfilesSkeleton";

const getUnfollowedProfilesByBio = async(profileId:string,profileBio:string) : Promise<Profile[] | null> => {
  if (!profileBio.trim()) return [];

  const { data, error } = await supabase.rpc("get_unfollowed_profiles_by_bio", {
    profile_id: profileId,
    profile_bio: profileBio,
  });

  if (error) throw new Error(error.message);
    return data;
}

export const SuggestedSidebar = ({profileId, profileBio}: {profileId: string, profileBio: string}) => {
  const { data, isLoading, error } = useQuery<Profile[] | null ,Error>({
    queryKey: ["unfollowedProfilesByBio", profileId, profileBio],
    queryFn: () => getUnfollowedProfilesByBio(profileId, profileBio),
    enabled: !!profileId && !!profileBio,
  });

  if(isLoading){
    return <SuggestedProfilesSkeleton />
  }
  if(error){
    return <p>Somthing went wrong. Try to refresh.</p>
  }
 
  return (
    <aside>
      <div className="bg-white  rounded-2xl p-4 shadow-sm">
        <h4 className="font-semibold mb-3">Suggested Users</h4>
        {data?.length === 0 ?  (<p>No suggested profiles. Edit profile to get suggestions.</p>):(
          <div className="space-y-3">
          {data?.map((profile) => (
            <SuggestedItem key={profile.id} profile={profile} />
          ))}
        </div>
        )}
      </div>
    </aside>
  );
};
