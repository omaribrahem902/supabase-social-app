import { type Community } from "../../Interfaces";
import { Link } from "react-router";
import { toggleDeleteModalStore, selectedCommunityStore } from "../globalStates/global_state";
import { useAuth } from "../../context/AuthContext";

export const CommunityItem = ({ community }: { community: Community }) => {
  const { setOpen } = toggleDeleteModalStore();
  const { setSelectedCommunity } = selectedCommunityStore();
  const {user} = useAuth();
  return (
    <div
      key={community.id}
      className="border border-gray-400 shadow-2xs hover:shadow-md shadow-neutral-400 py-2 lg:py-4 px-2 lg:px-7 rounded-xl lg:rounded-2xl hover:-translate-y-1 transition transform"
    >
      <div className="flex justify-between items-center">
        <div>
          <Link
            to={`/communities/${community.id}`}
            className="text-lg lg:text-2xl font-bold text-purple-500 hover:underline"
          >
            {community.name}
          </Link>
          <p className="text-gray-400 mt-2 text-xs lg:text-sm">
            {community.description}
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCommunity(community);
            setOpen(true);
          }}
          className={`bg-red-600 text-white rounded-md py-1 px-3 cursor-pointer ${!user || user.id !== community.user_id ? "hidden" : ""}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
