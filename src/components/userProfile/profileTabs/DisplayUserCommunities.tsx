import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../../../supabase-client"
import type { Community } from "../../../Interfaces";
import { ErrorPage } from "../../../pages/ErrorPage";
import { CommunityItem } from "../../communities/CommunityItem";
import { CommunitySkeleton } from "../../skeletons/CommunitySkeleton";
import { toggleDeleteModalStore } from "../../globalStates/global_state";
import { selectedCommunityStore } from "../../globalStates/global_state";
import { DeleteModal } from "../../DeleteModal";
interface Props{
    profileId: string;
}

async function fetchUserCommunities(profileId: string) : Promise<Community[]> {
    const {data, error} = await supabase.from('Communities').select('id,user_id, name, description').eq('user_id', profileId).order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data as Community[];
}

export const DisplayUserCommunities = ({profileId}: Props) => {
    const {data: communities, error, isLoading} = useQuery<Community[], Error>({
        queryKey: ['userCommunities', profileId],
        queryFn: () => fetchUserCommunities(profileId)

    })
    const selectedCommunity = selectedCommunityStore((state) => state.selectedCommunity);
    const open = toggleDeleteModalStore((state) => state.open);
    const setOpen = toggleDeleteModalStore((state) => state.setOpen);
    const queryClient = useQueryClient();

    async function handleDeleteCommunity(communityId: number): Promise<void> {
        const { error } = await supabase
          .from("Communities")
          .delete()
          .eq("id", communityId);
        if (error) throw new Error(error.message);
        queryClient.invalidateQueries({ queryKey: ["Communities"] }); // refresh the communities query
      }
      
    if(isLoading){
        return(
            <div className="flex flex-col gap-3 justify-center">
                {Array.from({ length: 2 }).map((_, i) => (
                    <CommunitySkeleton key={i} />
                ))}
            </div>
        )
    }
    if(error){
        return <ErrorPage message={error.message} />
    }
    return (
      <>
        {communities?.length === 0 ? (
          <p>Not created any communities yet</p>
        ) : (
          <div>
            <div className="flex flex-col gap-2">
              {communities?.map((c: Community) => (
                <CommunityItem key={c.id} community={c} />
              ))}
            </div>
            {selectedCommunity && (
              <DeleteModal
                onConfirm={() => handleDeleteCommunity(selectedCommunity.id)}
                open={open}
                setOpen={setOpen}
                title="Are you sure you want to delete this community?"
                description={`This will permanently delete "${selectedCommunity.name}" and all its posts.`}
              />
            )}
          </div>
        )}
      </>
    );
}