import { SearchBar } from "../components/SearchBar";
import type {TrendingPost } from "../Interfaces";
import { PostItem } from "../components/posts/PostItem";
import { supabase } from "../supabase-client";
import { useQuery } from "@tanstack/react-query";
import { PostSkeleton } from "../components/skeletons/PostSkeleton";
import { ErrorPage } from "./ErrorPage";

export const getTopPostsLast24h = async (): Promise<TrendingPost[]> => {
  const { data, error } = await supabase.rpc("get_top_posts_last_24h", {
    limit_count: 8,
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

  return (
    <div>
      <div>
        <SearchBar type="posts" />
        <div className="flex flex-wrap gap-6 justify-center">
          {data?.length ?(
          data?.map((post: TrendingPost) => <PostItem post={post} key={post.id} />)
          ):(
            <p>No trending posts found</p>
          )
          }
        </div>
      </div>
    </div>
  );
};
