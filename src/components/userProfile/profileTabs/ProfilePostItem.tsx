import { Link } from "react-router";
import { Heart } from "lucide-react";

export const ProfilePostItem = ({
  post,
}: {
  post: {
    id: number;
    title: string;
    content: string;
    created_at: string;
  };
}) => {
  return (
    <Link to={`/post/${post.id}`} className="block group">
      <div
        className="relative bg-[#111827] 
                   border border-white/10 
                   rounded-xl p-4 
                   transition-all duration-300
                   hover:border-purple-500/40
                   hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]"
      >
        {/* Title + Date */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">
            {post.title}
          </h3>

          <div className="text-xs text-gray-400">
            {new Date(post.created_at).toLocaleDateString("en-US")}
          </div>
        </div>

        {/* Content */}
        <p className="mt-2 text-sm text-gray-300 line-clamp-2">
          {post.content}
        </p>

        {/* Divider */}
        <div className="mt-4 border-t border-white/10 pt-3 flex items-center">
          <Heart
            size={16}
            className="text-purple-400 group-hover:scale-110 transition"
          />
        </div>
      </div>
    </Link>
  );
};