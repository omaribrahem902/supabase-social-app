export const SuggestedItem = ({ name, desc }: { name: string; desc: string }) => {
    return (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-gray-200" />
        <div className="flex-1">
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-gray-500">{desc}</div>
        </div>
        <button className="px-2 py-1 text-xs rounded bg-gray-100">Follow</button>
      </div>
    );
  }