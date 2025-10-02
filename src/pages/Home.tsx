import { PostList } from "../components/posts/PostList"
import { SearchBar } from "../components/SearchBar"
import type { Post } from "../Interfaces"
import { PostItem } from "../components/posts/PostItem"
import {searchStore} from "../components/globalStates/global_state"

export const Home = () => {
    const searchPostResults = searchStore((state) => state.searchPostResults);
    return (
        <div className="">
            <div>
                <SearchBar type="posts"/>
                <div className="flex flex-wrap gap-6 justify-center">
                {searchPostResults.length > 0 ? (
                    searchPostResults.map((post:Post) => (
                        <PostItem post={post} key={post.id} />
                    ))
                ) : (
                    <PostList />
                )}
                </div>
            </div>
        </div>
    )
}