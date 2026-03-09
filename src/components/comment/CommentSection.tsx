import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase-client";
import { CommentItem } from "./CommentItem";
import type { NewComment } from "../../Interfaces";
import type { Comment } from "../../Interfaces";
import { profileStore } from "../userProfile/userProfileStore";

interface Props {
  postId: number;
}

const createComment = async (
  newComment: NewComment,
  postId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) {
    throw new Error("You must be logged in to comment.");
  }

  const { error } = await supabase.from("Comments").insert({
    post_id: postId,
    content: newComment.content,
    parent_comment_id: newComment.parent_comment_id || null,
    user_id: userId,
    author: author,
  });

  if (error) throw new Error(error.message);
};

const fetchComments = async (postId: number): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("Comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data as Comment[];
};

export const CommentSection = ({ postId }: Props) => {
  const [newCommentText, setNewCommentText] = useState<string>("");
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const profile = profileStore((state) => state.profile);
  
  const {
    data: comments,
    isLoading,
    error,
  } = useQuery<Comment[], Error>({
    queryKey: ["Comments", postId],
    queryFn: () => fetchComments(postId),
    refetchInterval: 20000,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: NewComment) =>
      createComment(
        newComment,
        postId,
        user?.id,
        user?.user_metadata?.user_name
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Comments", postId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText) return;
    mutate({ content: newCommentText, parent_comment_id: null });
    setNewCommentText("");
  };

  /* Map of Comments - Organize Replies - Return Tree  */
  const buildCommentTree = (
    flatComments: Comment[]
  ): (Comment & { children?: Comment[] })[] => {
    const map = new Map<number, Comment & { children?: Comment[] }>();
    const roots: (Comment & { children?: Comment[] })[] = [];

    flatComments.forEach((comment) => {
      map.set(comment.id, { ...comment, children: [] });
    });

    flatComments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = map.get(comment.parent_comment_id);
        if (parent) {
          parent.children!.push(map.get(comment.id)!);
        }
      } else {
        roots.push(map.get(comment.id)!);
      }
    });

    return roots;
  };

  if (isLoading) {
    return <div> Loading comments...</div>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  const commentTree = comments ? buildCommentTree(comments) : [];

  return (
  <div className="space-y-6">

    {/* ================= COMMENT INPUT ================= */}
    {user ? (
      <form onSubmit={handleSubmit}>

        <div className="flex items-center gap-3 p-[1px] rounded-xl bg-gradient-to-r from-purple-500 to-blue-500">

          <div className="flex items-center gap-1 lg:gap-3 bg-[#0F172A] rounded-xl w-full px-2 py-1 lg:px-3 lg:py-2">

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center font-semibold text-white">
              {profile?.avatar_url &&<img className="rounded-full w-9 h-9" src={profile.avatar_url} alt="avatar image" />}
            </div>

            {/* Input */}
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-transparent outline-none text-sm lg:text-md text-white placeholder-gray-400"
            />

            {/* Button */}
            <button
              type="submit"
              disabled={isPending}
              className="lg:px-5 px-2 py-1 lg:py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 transition text-xs lg:text-sm font-medium cursor-pointer"
            >
              {isPending ? "Posting..." : "Comment"}
            </button>

          </div>
        </div>

        {isError && (
          <p className="text-red-500 mt-2">Error posting comment.</p>
        )}

      </form>
    ) : (
      <p className="text-gray-400">
        You must be logged in to post a comment.
      </p>
    )}


    {/* ================= COMMENTS LIST ================= */}
    <div className="space-y-4">

      {commentTree.map((comment) => (
        <div
          key={comment.id}
          className="bg-[#111C2D] border border-white/5 rounded-xl px-2 py-1 lg:px-4 lg:py-2 shadow-md"
        >
          <CommentItem comment={comment} postId={postId} />
        </div>
      ))}

    </div>

  </div>
);
};