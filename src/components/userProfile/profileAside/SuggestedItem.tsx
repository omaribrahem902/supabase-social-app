import type { Profile } from "../../../Interfaces";
import { Link } from "react-router";

export const SuggestedItem = ({ profile }: { profile: Profile }) => {
    return (
      <div className="flex items-start gap-2">
        <Link className="flex items-center gap-3" to={`/profile/${profile.id}`}>
        <img className="w-10 h-10 rounded-full" src={profile.avatar_url || ""} alt="" />
        <div className="flex-1">
          <div className="text-sm font-medium">{profile.name}</div>
          <div className="text-xs text-gray-500">{profile.bio}</div>
        </div>
        </Link>
      </div>
    );
  }