import { Link } from "react-router";
import type { Post , TrendingPost } from "../../Interfaces";

interface Props {
  post: Post | TrendingPost;
}

const formatCustom12Hour = (dateString: string) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${day} ${month} ${year} - ${hours}:${minutes} ${ampm}`;
};

export const PostItem = ({ post }: Props) => {
  return (
    <div className="w-80 relative group min-h-[338px]">
      <div className="relative z-10">
        <div className=" h-[338px] relative 
            bg-white/5 
            backdrop-blur-xl 
            border border-white/10 
            hover:border-[#8A2BE2]
            hover: delay-100
            hover: duration-300
            rounded-2xl 
            shadow-[0_0_30px_rgba(168,85,247,0.25)] 
            p-6">
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
              <p className="text-[10px] text-gray-400 leading-[22px] font-semibold">{formatCustom12Hour(post.created_at)}</p>
            </div>
          </Link>
          <Link to={`/post/${post.id}`}>
          <h3 className="text-[18px] font-semibold pl-2 mt-1">{post.title}</h3>
          
          {/* Image Banner */}
          <div className="mt-1 flex-1">
            <img
              src={post.image_url}
              alt={post.title}
              className="rounded-[20px] object-cover max-h-[185px] mx-auto "
              loading="lazy"
              width="278"
              height="185"
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