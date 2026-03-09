import { PostList } from "../components/posts/PostList";
import { SearchBar } from "../components/SearchBar";
import type { Post } from "../Interfaces";
import { PostItem } from "../components/posts/PostItem";
import { searchStore } from "../components/globalStates/global_state";
import { useAuth } from "../context/AuthContext";
import { FloatingCreateButton } from "../components/Tooltip";

export const Home = () => {
  const { user } = useAuth();
  const searchPostResults = searchStore((state) => state.searchPostResults);
  return (
      <>
        <section
          className="relative overflow-hidden rounded-3xl 
                bg-gradient-to-br from-purple-600/30 via-blue-500/20 to-sky-400/20
                backdrop-blur-xl
                border border-white/10
                shadow-[0_0_60px_rgba(168,85,247,0.25)]
                p-6
                lg:p-12
                mb-6"
        >
          <div
            className="absolute inset-0 opacity-30 
              bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.4),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(14,165,233,0.4),transparent_40%)]"
          ></div>

          <div className="relative z-10 text-center">
            <h1
              className="text-lg md:text-5xl font-bold 
               bg-gradient-to-r from-white via-purple-200 to-blue-200
               bg-clip-text text-transparent"
            >
              Welcome back, {user?.user_metadata.name}
            </h1>

            <div className="lg:mt-8 mt-4 flex justify-center">
              <SearchBar type="posts" />
            </div>
          </div>
        </section>
        <section className="flex justify-center">
          <div className=" grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
            {searchPostResults.length > 0 ? (
              searchPostResults.map((post: Post) => (
                <PostItem post={post} key={post.id} />
              ))
            ) : (
              <PostList />
            )}
          </div>
          <FloatingCreateButton />
        </section>
      </>
  );
};
