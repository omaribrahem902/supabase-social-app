import { SearchBar } from "../components/SearchBar";
import type {TrendingPost } from "../Interfaces";
import { PostItem } from "../components/posts/PostItem";
import { supabase } from "../supabase-client";
import { useQuery } from "@tanstack/react-query";
import { PostSkeleton } from "../components/skeletons/PostSkeleton";
import { ErrorPage } from "./ErrorPage";

 const getTopPostsLast24h = async (): Promise<TrendingPost[]> => {
  const { data, error } = await supabase.rpc("get_top_posts_last_24h", {
    limit_count: 12,
  });
  if (error) throw new Error(error.message);
  console.log("Trending posts data:", data);
  return data as TrendingPost[];
};

export const TrendingPage = () => {
  const { data, error, isLoading } = useQuery<TrendingPost[], Error>({
    queryKey: ["getTopPostsLast24h"],
    queryFn: getTopPostsLast24h,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
      <div className="flex flex-wrap gap-6 justify-center">
        {Array.from({ length: 4 }).map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
      </div>
    );
  }

  if (error) {
    return <ErrorPage message={error.message} />;
  }

  return (
    <div className="min-h-screen">
      
        <h1 className="text-4xl text-center mb-5 font-bold">Posts were created in the last 24 hours</h1>
        <SearchBar type="posts" />
        <div className="flex justify-center">
          {data?.length ?(      
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
            {data.map((post) => (
              <PostItem post={post} key={post.id} />
            ))}
          </div>
          ):(
              <h1 className="text-center text-lg lg:text-2xl capitalize">No trending posts found try again later</h1>
          )
          }
          </div>
        </div>
          
  );
};
