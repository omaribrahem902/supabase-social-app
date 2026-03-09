import { useQuery } from "@tanstack/react-query";
import type { Post } from "../../Interfaces";
import { supabase } from "../../supabase-client";
import { LikeButton } from "../LikeButton";
import { CommentSection } from "../comment/CommentSection";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { DeleteModal } from "../DeleteModal";
import { useState } from "react";
import { ErrorPage } from "../../pages/ErrorPage";
import { PostDetailsSkeleton } from "../skeletons/PostDetailsSkeleton";
import { Trash2 } from "lucide-react";

interface Props {
    postId: number;
}

const fetchPost = async (id:number): Promise<Post> => {
    const { data, error } = await supabase.from("Posts").select("*").eq("id",id).single();
  
    if (error) throw new Error(error.message);
    
    return data as Post;
  };

export const PostDetails = ({postId}:Props)=>{

  const {user} =useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { data, error, isLoading } = useQuery<Post, Error>({
      queryKey: ["post",postId],
      queryFn: ()=> fetchPost(postId),
    });
    console.log(data);
  
    if (isLoading) {
      return <PostDetailsSkeleton />;
    }
  
    if (error) {
      return <ErrorPage message={error.message} />;
    }

  async function handleDeletePost(): Promise<void> {
    if(!user) return;
    if(data?.user_id === user.id){
     const { error } = await supabase.from("Posts").delete().eq("id", postId);
     if (error) throw new Error(error.message);
     navigate("/");
  }

}

   return (
  <div className="min-h-screen bg-[#0B1120] text-white px-4 lg:px-10 py-10">

    <div className="max-w-5xl mx-auto space-y-8">

      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden">

        {data?.image_url && (
          <img
            src={data.image_url}
            alt={data?.title}
            className="w-full h-64 lg:h-[500px] object-cover"
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/10 to-transparent" />

        {/* User Info Card */}
        <div className="absolute bottom-4 left-2 lg:bottom-6 lg:left-6 text-[12px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg lg:rounded-2xl px-1 lg:px-5 py-1 lg:py-3 flex items-center lg:gap-4 gap-2 shadow-xl">
          <div className="lg:w-10 w-8 lg:h-10 h-8 rounded-full bg-[#0B1120]  lg:text-xl flex items-center justify-center font-bold">
            {data?.user_name?.charAt(0)}
          </div>
          <div>
            <p className="font-semibold">{data?.user_name}</p>
            <p className="text-[8px] lg:text-xs text-gray-300">
              Posted on {new Date(data!.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className="mb-2 lg:mb-6 text-lg lg:text-3xl font-bold">
        {data?.title}
      </h1>

      {/* Content */}
      <p className="mb-2 lg:mb-6 text-gray-400 text-lg">
        {data?.content}
      </p>

      {/* Action Buttons */}
      <div className="flex justify-center lg:justify-start gap-2 lg:gap-6 pt-4">
            <LikeButton postId={postId} />
      </div>

      {/* Delete Button */}
      {user && user.id === data?.user_id && (
        <div className="pt-4">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2 transition cursor-pointer"
          >
            <Trash2 size={20} color="#ffffff" strokeWidth={1.25} /> Delete Post
          </button>
        </div>
      )}

      <DeleteModal
        onConfirm={() => handleDeletePost()}
        open={open}
        setOpen={setOpen}
        title="Are you sure you want to delete this post?"
        description="This action cannot be undone. This will permanently delete the post and all its comments."
      />

      {/* Discussion Section */}
      <div className="pt-10 space-y-6">

        <h2 className="text-2xl font-semibold">
          Discussion
        </h2>

        <div className="rounded-xl p-[1px] bg-gradient-to-br from-purple-500/40 to-blue-500/40">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-2 lg:p-6">
            <CommentSection postId={postId} />
          </div>
        </div>

      </div>

    </div>
  </div>
);
}
