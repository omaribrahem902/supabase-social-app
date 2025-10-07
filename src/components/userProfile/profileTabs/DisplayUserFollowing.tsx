import { useQuery } from "@tanstack/react-query"
import { supabase } from "../../../supabase-client"
import type { Profile } from "../../../Interfaces";
import { ErrorPage } from "../../../pages/ErrorPage";
import { SuggestedItem } from "../profileAside/SuggestedItem";
import { ProfileItemSkeleton } from "../../skeletons/profileSkeletons/ProfileItemSkeleton";

interface Props{
    profileId: string;
}

async function fetchUserFollowing(profileId: string) : Promise<Profile[] | null> {
    const { data, error } = await supabase.rpc("get_following_profiles", {profile_id: profileId},);
    if (error) throw new Error(error.message);
    return data as Profile[] || null;
}

export const DisplayUserFollowing = ({profileId}: Props) => {
    const {data: Followings, error, isLoading} = useQuery<Profile[] | null, Error>({
        queryKey: ['profileFollowings', profileId],
        queryFn: () => fetchUserFollowing(profileId)

    })
    if(isLoading){
        return(
            <div className="flex flex-col gap-3 justify-center">
                {Array.from({ length: 3 }).map((_, i) => (
                    <ProfileItemSkeleton key={i}/>
                ))}
            </div>
        )
    }
    if(error){
        return <ErrorPage message={error.message} />
    }
    return (
      <>
        {Followings?.length === 0 ? (
          <p>Not following anyone yet</p>
        ) : (
          <div className="flex flex-col gap-3">
            {Followings?.map((p: Profile) => (
              <SuggestedItem key={p.id} profile={p} />
            ))}
          </div>
        )}
      </>
    );
}