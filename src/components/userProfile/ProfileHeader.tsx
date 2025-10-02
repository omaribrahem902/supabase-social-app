import { editProfileStore } from "./userProfileStore";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase-client";
import type { Profile } from "../../Interfaces";
interface Props {
    userId: string;
}

export const fetchUser = async (userId: string): Promise<Profile | undefined> => {
  const { data, error } = await supabase
    .from("Profiles")
    .select("*")
    .eq("id", userId);

  if (error) throw new Error(error.message);
  return data?.[0]; 
};

export const ProfileHeader = ({ userId }: Props) => {
  const isEditProfileOpen = editProfileStore((state) => state.isEditProfileOpen);
  const setIsEditProfileOpen = editProfileStore((state) => state.setIsEditProfileOpen);

  const { data, error, isLoading } = useQuery<Profile | undefined, Error>({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No profile found</div>;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          {data?.avatar_url ? 
          <img className="rounded-full w-28 h-28" src={data.avatar_url} alt="Profile" />
          : <div className="w-28 h-28 rounded-full bg-gray-200 border border-gray-300" />}
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{data?.name}</h2>
          <p className="mt-3 text-sm text-gray-700">{data?.bio}</p>
        </div>

        <div className="flex flex-col justify-between gap-2 md:gap-0">
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className={`${isEditProfileOpen ? "opacity-0" : "block"} px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm cursor-pointer`}
          >
            Edit Profile
          </button>
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm cursor-pointer">
            Follow
          </button>
        </div>
      </div>
    </div>
  );
};

