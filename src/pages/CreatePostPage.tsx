import { CreatePost } from "../components/posts/CreatePost";

export const CreatePostPage = () => {
  return (
    <div>
      <h2 className="text-3xl lg:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Create New Post
      </h2>
      <CreatePost />
    </div>
  );
};
