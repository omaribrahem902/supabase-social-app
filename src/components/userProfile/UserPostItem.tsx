
export const UserPostItem = ({ post }: { post: { id: string; title: string; excerpt: string; time: string } }) => {
    return (
      <article className="bg-gray-50 border border-gray-100 rounded-lg p-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-200" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{post.title}</h3>
              <div className="text-xs text-gray-500">{post.time}</div>
            </div>
            <p className="mt-2 text-sm text-gray-700">{post.excerpt}</p>
  
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
              <button className="hover:text-blue-600">Like</button>
              <button className="hover:text-blue-600">Comment</button>
              <button className="hover:text-blue-600">Share</button>
            </div>
          </div>
        </div>
      </article>
    );
  }