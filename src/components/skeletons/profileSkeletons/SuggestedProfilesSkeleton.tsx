import { ProfileItemSkeleton } from "./ProfileItemSkeleton";

export const SuggestedProfilesSkeleton = () => {
  return (
    <aside>
      <div className="animate-pulse bg-[#0b1120] border border-gray-600 rounded-2xl p-4 shadow-sm">
        <h4 className="font-semibold mb-3">Suggested Users</h4>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <ProfileItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </aside>
  );
};
