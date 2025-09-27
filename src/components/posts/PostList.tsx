import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase-client";
import { PostItem } from "./PostItem";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { SkeletonLoader } from "../skeletons/PostSkeleton";
import SpinnerLoader from "../SpinnerLoader";

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
  avatar_url?: string;
  like_count?: number;
  comment_count?: number;
  user_id: string | null;
}

const LIMIT = 8;

// type-safe fetch function
const fetchPosts = async ({ pageParam = 0 }: { pageParam?: number }): Promise<Post[]> => {
  const from = pageParam * LIMIT;
  const to = from + LIMIT - 1;

  const { data, error } = await supabase
    .rpc("get_posts_with_counts")
    .range(from, to);

  if (error) throw new Error(error.message);

  return data as Post[];
};

export const PostList = () => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<Post[],Error,Post[],string[],number>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < LIMIT) return undefined; // no more pages
      return allPages.length; // next page index
    },
    initialPageParam: 0, 
  });

  // intersection observer
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-6 justify-center">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonLoader key={i} />
        ))}
      </div>)
  }

  if (error) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {data?.pages.map((page, i) => (
        <div key={i} className="contents">
          {page.map((post) => (
            <PostItem post={post} key={post.id} />
          ))}
        </div>
      ))}
      {/* loader / trigger */}
      <div ref={ref} className="h-10 flex justify-center items-center w-full">
        {isFetchingNextPage && <SpinnerLoader />}
      </div>
    </div>
  );
};
