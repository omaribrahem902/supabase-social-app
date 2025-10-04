import { CommunityList } from "../components/communities/CommunityList"
import { SearchBar } from "../components/SearchBar"
import { searchStore } from "../components/globalStates/global_state"
import { CommunityItem } from "../components/communities/CommunityItem"
import type { Community } from "../Interfaces"
import { toggleDeleteModalStore } from "../components/globalStates/global_state"
import { selectedCommunityStore } from "../components/globalStates/global_state"
import { DeleteModal } from "../components/DeleteModal"
import { useQueryClient } from "@tanstack/react-query"
import { supabase } from "../supabase-client"

export const CommunitiesPage = ()=>{
    const searchCommunityResults = searchStore((state) => state.searchCommunityResults);
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
    
    return(
        <div>
            <SearchBar type="communities"/>
            <div className="max-w-5xl mx-auto space-y-4">
                {searchCommunityResults.length > 0 ? (
                    searchCommunityResults.map((community:Community) => (
                        <CommunityItem community={community} key={community.id} />
                    ))
                ) : (
                    <CommunityList />
                )}
            </div>
            {/* Global Delete Modal */}
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
    )
}