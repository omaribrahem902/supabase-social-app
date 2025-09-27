import { PostList } from "../components/posts/PostList"

export const Home = () => {
    return (
        <div className="mt-24">
            {/* <h2 className="text-3xl lg:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Recent Posts
            </h2> */}
            <div>
                <PostList />
            </div>
        </div>
    )
}