import { Link } from "react-router";
import type { Post , TrendingPost } from "../../Interfaces";

interface Props {
  post: Post | TrendingPost;
}

export const PostItem = ({ post }: Props) => {
  return (
    <div className="relative group min-h-[338px]">
      <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-pink-600 to-purple-600 blur-sm opacity-0 group-hover:opacity-50 transition duration-300 pointer-events-none"></div>
      <div className="block relative z-10">
        <div className="w-80 h-[338px] bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-[20px] text-white flex flex-col p-5 overflow-hidden transition-colors duration-300 group-hover:bg-gray-800">
          {/* Header: Avatar and Title */}
          <Link to={`/profile/${post.user_id}`} className="flex items-center space-x-2">
          
            {post.avatar_url ? (
              <img
                src={post.avatar_url}
                alt="User Avatar"
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-tl from-[#8A2BE2] to-[#491F70]" />
            )}
            <div className="flex flex-col flex-1">
              <div className= "text-[12px] leading-[22px] font-semibold">
                {post.user_name}
              </div>
            </div>
          </Link>
          <Link to={`/post/${post.id}`}>
          <h3 className="text-[18px] font-semibold pl-2 mt-1">{post.title}</h3>
          
          {/* Image Banner */}
          <div className="mt-1 flex-1">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full rounded-[20px] object-cover max-h-[185px] mx-auto "
            />
          </div>
          <div className="flex justify-around items-center">
            <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg">
              ❤️ <span className="ml-2">{post.like_count ?? 0}</span>
            </span>
            <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg">
              💬 <span className="ml-2">{post.comment_count ?? 0}</span>
            </span>
          </div>
          </Link>
        </div>
      </div>
    </div>
  );
};