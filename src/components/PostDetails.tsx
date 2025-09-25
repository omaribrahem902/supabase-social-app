import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { LikeButton } from "../components/LikeButton";
import { CommentSection } from "./CommentSection";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { DeleteModal } from "./DeleteModal";
import { useState } from "react";

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
  
    if (isLoading) {
      return <div> Loading posts...</div>;
    }
  
    if (error) {
      return <div> Error: {error.message}</div>;
    }

  async function handleDeletePost(): Promise<void> {
    if(!user) return;
    if(data?.user_id == user.id){
     const { error } = await supabase.from("Posts").delete().eq("id", postId);
     if (error) throw new Error(error.message);
     navigate("/");
  }

}

    return(
        <div className="space-y-6 lg:mx-10">
        <h2 className="text-2xl lg:text-6xl font-bold mb-8 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          {data?.title}
        </h2>
        {data?.image_url && (
          <img
            src={data.image_url}
            alt={data?.title}
            className="mt-4 rounded object-cover w-full h-64 lg:h-[500px] "
          />
        )}
        <p className="text-gray-400">{data?.content}</p>
        <p className="text-gray-500 text-sm">
          Posted on: {new Date(data!.created_at).toLocaleDateString()}
        </p>
  
        <LikeButton postId={postId} />
        <div className="flex justify-start lg:justify-center">
        <button
              onClick={() => {
                setOpen(true);
              }}
              className="bg-red-600 text-white rounded-md py-1 px-3 cursor-pointer"
            >
              Delete
            </button>
        </div>
        <div className="flex justify-start lg:justify-center">
          <DeleteModal
            onConfirm={()=>handleDeletePost()}
            open={open}
            setOpen={setOpen}
            title="Are you sure you want to delete this post?"
            description="This action cannot be undone. This will permanently delete the post and all its comments."
          />
        </div>
        <CommentSection postId={postId} />
      </div>
    )
}