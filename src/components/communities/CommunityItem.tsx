import { type Community } from "../../Interfaces";
import { Link } from "react-router";
import {
  toggleDeleteModalStore,
  selectedCommunityStore,
} from "../globalStates/global_state";
import { useAuth } from "../../context/AuthContext";
import { Trash2 } from "lucide-react";

export const CommunityItem = ({ community }: { community: Community }) => {
  const setOpen = toggleDeleteModalStore((state) => state.setOpen);
  const setSelectedCommunity = selectedCommunityStore(
    (state) => state.setSelectedCommunity,
  );
  const { user } = useAuth();
  return (
    <div
      key={community.id}
      className="relative rounded-3xl p-[1px] bg-gradient-to-br from-purple-500/40 via-blue-500/30 to-cyan-400/40 hover:scale-[1.02] transition duration-300"
    >
      <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 space-y-4">
        <h3 className="text-xl font-semibold">{community.name}</h3>

        <p className="text-gray-400 text-sm">{community.description}</p>

        <Link
          to={`/communities/${community.id}`}
          className="block text-center w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition"
        >
          View Community
        </Link>
      <button
        onClick={() => {
          setSelectedCommunity(community);
          setOpen(true);
        }}
        className={`flex justify-center items-center gap-2 w-full bg-red-600 text-white rounded-md py-1 px-3 cursor-pointer ${!user || user.id !== community.user_id ? "hidden" : ""}`}
      >
        <Trash2 size={20} color="#ffffff" strokeWidth={1.25} /> Delete
      </button>
      </div>
    </div>
  );
};
