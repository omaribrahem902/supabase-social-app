export const StatsBar = () => {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="grid grid-cols-4 text-center">
          <div>
            <div className="text-lg font-semibold">300</div>
            <div className="text-sm text-gray-500">Posts</div>
          </div>
          <div>
            <div className="text-lg font-semibold">234</div>
            <div className="text-sm text-gray-500">Followers</div>
          </div>
          <div>
            <div className="text-lg font-semibold">128</div>
            <div className="text-sm text-gray-500">Following</div>
          </div>
          <div>
            <div className="text-lg font-semibold">5</div>
            <div className="text-sm text-gray-500">Communities</div>
          </div>
        </div>
      </div>
    );
  }