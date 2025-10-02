export const CommunityCard = ({ name, members }: { name: string; members: number }) => {
    return (
      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-100">
        <div>
          <div className="font-medium text-sm">{name}</div>
          <div className="text-xs text-gray-500">{members} members</div>
        </div>
        <button className="px-3 py-1 rounded-md text-sm bg-blue-600 text-white">Join</button>
      </div>
    );
  }
  