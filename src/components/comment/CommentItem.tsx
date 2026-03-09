import { useState } from "react";
import type { Comment } from "../../Interfaces";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileStore } from "../userProfile/userProfileStore";

interface Props {
  comment: Comment & {
    children?: Comment[];
  };
  postId: number;
}

const createReply = async (
  replyContent: string,
  postId: number,
  parentCommentId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) {
    throw new Error("You must be logged in to reply.");
  }

  const { error } = await supabase.from("Comments").insert({
    post_id: postId,
    content: replyContent,
    parent_comment_id: parentCommentId,
    user_id: userId,
    author: author,
  });

  if (error) throw new Error(error.message);
};

export const CommentItem = ({ comment, postId }: Props) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const profile = profileStore((state) => state.profile);


  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (replyContent: string) =>
      createReply(
        replyContent,
        postId,
        comment.id,
        user?.id,
        user?.user_metadata?.user_name
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Comments", postId] });
      setReplyText("");
      setShowReply(false);
    },
  });

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText) return;
    mutate(replyText);
  };

  return (
    <div className="space-y-3">

      {/* COMMENT CARD  */}
      <div className="bg-[#111C2D] border border-white/5 rounded-xl p-4 shadow-md">

        <div className="flex gap-3">

          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-sm font-semibold text-white">
            {profile?.avatar_url &&<img className="rounded-full w-9 h-9" src={profile.avatar_url} alt="avatar image" />}
          </div>

          <div className="flex-1">

            {/* Name + Date */}
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-white">
                {comment.author}
              </p>
              <span className="text-xs text-gray-400">
                {new Date(comment.created_at).toLocaleString()}
              </span>
            </div>

            {/* Content */}
            <p className="text-gray-300 mt-2">
              {comment.content}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-3">

              <button
                onClick={() => setShowReply((prev) => !prev)}
                className="px-3 py-1 text-xs rounded-full bg-[#1E293B] hover:bg-[#2A3A55] transition"
              >
                {showReply ? "Cancel" : "Reply"}
              </button>

              {comment.children && comment.children.length > 0 && (
                <button
                  onClick={() => setIsCollapsed((prev) => !prev)}
                  className="text-xs text-gray-400 hover:text-white transition"
                >
                  {isCollapsed
                    ? `Show Replies (${comment.children.length})`
                    : `Hide Replies`}
                </button>
              )}

            </div>

          </div>
        </div>
      </div>

      {/*  REPLY INPUT  */}
      {showReply && user && (
        <form onSubmit={handleReplySubmit} className="ml-2 lg:ml-14">

          <div className="flex items-center gap-3 p-[1px] rounded-full bg-gradient-to-r from-purple-500 to-blue-500">

            <div className="flex items-center gap-1 lg:gap-3 bg-[#0F172A] rounded-full w-full px-2 py-1 lg:px-3 lg:py-2">

              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-xs font-semibold text-white">
                {profile?.avatar_url &&<img className="rounded-full w-7 h-7" src={profile.avatar_url} alt="avatar image" />}
              </div>

              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-sm"
              />

              <button
                type="submit"
                disabled={isPending}
                className="px-2 lg:px-4 py-1 lg:py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 transition text-xs"
              >
                {isPending ? "Posting..." : "Reply"}
              </button>

            </div>
          </div>

          {isError && (
            <p className="text-red-500 text-xs mt-2">
              Error posting reply.
            </p>
          )}
        </form>
      )}

      {/* CHILD COMMENTS */}
      {!isCollapsed && comment.children && comment.children.length > 0 && (
        <div className="ml-2 lg:ml-10 space-y-3 border-l border-white/10 pl-6">
          {comment.children.map((child: Comment) => (
            <CommentItem
              key={child.id}
              comment={child}
              postId={postId}
            />
          ))}
        </div>
      )}

    </div>
  );
};