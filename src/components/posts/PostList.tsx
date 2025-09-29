import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase-client";
import { PostItem } from "./PostItem";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { PostSkeleton } from "../skeletons/PostSkeleton";
import SpinnerLoader from "../SpinnerLoader";
import { type InfiniteData } from "@tanstack/react-query";
import { ErrorPage } from "../../pages/ErrorPage";
import type { Post } from "../../Interfaces";

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
  } = useInfiniteQuery<Post[],Error,InfiniteData<Post[]>,string[],number>({
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
          <PostSkeleton key={i} />
        ))}
      </div>)
  }

  if (error) {
    return <ErrorPage message={error.message} />;
  }

  return (
    <>
      {data?.pages.map((page:Post[], i:number) => (
        <div key={i} className="contents">
          {page.map((post:Post) => (
            <PostItem post={post} key={post.id} />
          ))}
        </div>
      ))}
      {/* loader / trigger */}
      <div ref={ref} className="h-10 flex justify-center items-center w-full">
        {isFetchingNextPage && <SpinnerLoader />}
      </div>
    </>
  );
};
