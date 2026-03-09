import { SearchBar } from "../components/SearchBar";
import type {TrendingPost } from "../Interfaces";
import { PostItem } from "../components/posts/PostItem";
import { supabase } from "../supabase-client";
import { useQuery } from "@tanstack/react-query";
import { PostSkeleton } from "../components/skeletons/PostSkeleton";
import { ErrorPage } from "./ErrorPage";

export const getTopPostsLast24h = async (): Promise<TrendingPost[]> => {
  const { data, error } = await supabase.rpc("get_top_posts_last_24h", {
    limit_count: 12,
  });
  if (error) throw new Error(error.message);
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
      
        <SearchBar type="posts" />
        <div className="flex justify-center">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          {data?.length ?(
          data?.map((post: TrendingPost) => <PostItem post={post} key={post.id} />)
          ):(
            <> </>
          )
          }
          </div>
        </div>
          <h1 className="text-center text-lg lg:text-2xl capitalize">No trending posts found try again later</h1>
    </div>
  );
};
