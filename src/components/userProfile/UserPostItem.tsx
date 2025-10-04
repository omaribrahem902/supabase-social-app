import { Link } from "react-router";


export const UserPostItem = ({ post }: { post: { id: number; title: string; content: string; created_at: string } }) => {
    return (
      <Link to={`/post/${post.id}`} className="">
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{post.title}</h3>
              <div className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</div>
            </div>
            <p className="mt-2 text-sm text-gray-700">{post.content}</p>
          </div>
        </div>
        </div>
      </Link>
    );
  }