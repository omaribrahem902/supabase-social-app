import { useQuery } from "@tanstack/react-query";
import type { Post } from "../../Interfaces";
import { supabase } from "../../supabase-client";
import { PostSkeleton } from "../../components/skeletons/PostSkeleton";
import { PostItem } from "../posts/PostItem";
import {ErrorPage} from "../../pages/ErrorPage";
interface Props {
    communityId: number;
}

interface postWithCommunity extends Post{
    Communities: {
        name: string;
    }
}

const fetchCommunityPosts = async (communityId:number): Promise<postWithCommunity[]> => {
    const { data, error } = await supabase.from("Posts").select("* , Communities(name)").eq("community_id",communityId);
  
    if (error) throw new Error(error.message);
    return data as postWithCommunity[] ;
  };

export const CommunityDisplay = ({communityId}:Props)=>{

    const { data, error, isLoading } = useQuery<postWithCommunity[], Error>({
        queryKey: ["communityPost",communityId],
        queryFn: ()=> fetchCommunityPosts(communityId),
        
      });
    
      if (isLoading) {
        return (
          <div className="flex flex-wrap gap-6 justify-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        );
      }
    
      if (error) {
        return <ErrorPage message={error.message} />;
      }

    return(
    <div>
      <h2 className="text-2xl lg:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {data && data.length > 0 && data[0].Communities.name} Community Posts
      </h2>

      {data && data.length > 0 ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {data.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">
          No posts in this community yet.
        </p>
      )}
    </div>
    )
}