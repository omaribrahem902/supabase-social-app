import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

interface Props {
  postId: number;
}

interface Vote {
  id?: number;
  post_id: number;
  user_id: string;
  vote: number; 
}

const fetchVotes = async (postId: number): Promise<Vote[]> => {
  const { data, error } = await supabase
    .from("Votes")
    .select("*")
    .eq("post_id", postId);

  if (error) throw new Error(error.message);
  return data || [];
};


// function that handles vote insert / update / delete
const vote = async (voteValue: number, postId: number, userId: string) => {
    // 1️⃣ check if user already voted
    const { data: existingVote, error: fetchError } = await supabase
      .from("Votes")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single();
  
    if (fetchError && fetchError.code !== "PGRST116") {
      throw new Error(fetchError.message);
    }
  
    // 2️⃣ if no vote exists → insert new one
    if (!existingVote) {
      const { data, error } = await supabase
        .from("Votes")
        .insert({
          post_id: postId,
          user_id: userId,
          vote: voteValue,
        })
        .select()
        .single();
  
      if (error) throw new Error(error.message);
      return data;
    }
  
    // 3️⃣ if same vote exists → delete it
    if (existingVote.vote === voteValue) {
      const { error: deleteError } = await supabase
        .from("Votes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId);
  
      if (deleteError) throw new Error(deleteError.message);
  
      // ✅ return marker instead of null
      return { id: existingVote.id, deleted: true };
    }
  
    // 4️⃣ if different vote exists → update it
    const { data, error } = await supabase
      .from("Votes")
      .update({ vote: voteValue })
      .eq("id", existingVote.id)
      .select()
      .single();
  
    if (error) throw new Error(error.message);
    return data;
  };
  
  

export const LikeButton = ({ postId }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: votes, isLoading, error } = useQuery<Vote[], Error>({
    queryKey: ["votes", postId],
    queryFn: () => fetchVotes(postId),
  });

  const { mutate } = useMutation({
    mutationFn: (voteValue: number) => {
      if (!user) throw new Error("You must be logged in to Vote!");
      return vote(voteValue, postId, user.id);
    },
  
    onMutate: async (voteValue: number) => {
      // Pause any outgoing refetches for this query
      await queryClient.cancelQueries({ queryKey: ["votes", postId] });
  
      // Snapshot the previous cache (to restore it if mutation fails)
      const previousVotes = queryClient.getQueryData<Vote[]>(["votes", postId]);
  
      // Perform an optimistic update
      queryClient.setQueryData<Vote[]>(["votes", postId], (oldVotes) => {
        if (!oldVotes) return [{ post_id: postId, user_id: user!.id, vote: voteValue }];
  
        const existingIndex = oldVotes.findIndex((v) => v.user_id === user!.id);
  
        if (existingIndex === -1) {
          // First time voting -> insert
          return [...oldVotes, { post_id: postId, user_id: user!.id, vote: voteValue }];
        } else {
          if (oldVotes[existingIndex].vote === voteValue) {
            // User clicked the same vote again -> delete
            return oldVotes.filter((_, i) => i !== existingIndex);
          } else {
            // User switched their vote -> update
            const updated = [...oldVotes];
            updated[existingIndex] = { ...updated[existingIndex], vote: voteValue };
            return updated;
          }
        }
      });
  
      // Return the previous cache so it can be rolled back in case of error
      return { previousVotes };
    },
  
    onError: (_err, _voteValue, context) => {
      // If mutation fails -> roll back to the previous cache
      if (context?.previousVotes) {
        queryClient.setQueryData(["votes", postId], context.previousVotes);
      }
    },
  
    onSettled: () => {
      // After mutation (success or error) → refetch to ensure cache is in sync with server
      queryClient.invalidateQueries({ queryKey: ["votes", postId] });
    },
  });
  

  if (isLoading) return <div>Loading votes...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const likes = votes?.filter((v) => v.vote === 1).length || 0;
  const dislikes = votes?.filter((v) => v.vote === -1).length || 0;
  // the current user vote
  const userVote = votes?.find((v) => v.user_id === user?.id && !("deleted" in v))?.vote;

  return (
    <div className="flex items-center space-x-4 my-4">
      <button
        onClick={() => mutate(1)}
        className={`px-3 py-1 rounded transition-colors duration-150 cursor-pointer ${
          userVote === 1 ? "bg-green-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        👍{likes}
      </button>
      <button
        onClick={() => mutate(-1)}
        className={`px-3 py-1 rounded transition-colors duration-150 cursor-pointer ${
          userVote === -1 ? "bg-red-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        👎{dislikes}
      </button>
    </div>
  );
};
