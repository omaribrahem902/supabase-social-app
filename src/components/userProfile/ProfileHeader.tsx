import { editProfileStore, profileCompletionStore, fetchUser, profileStore } from "./userProfileStore";
import { useQuery } from "@tanstack/react-query";
import type { Profile } from "../../Interfaces";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
interface Props {
    userId: string;
}


export const ProfileHeader = ({ userId }: Props) => {
  const isEditProfileOpen = editProfileStore((state) => state.isEditProfileOpen);
  const setIsEditProfileOpen = editProfileStore((state) => state.setIsEditProfileOpen);
  const profileCompletion = profileCompletionStore((state) => state.profileCompletion);
  const setProfileCompletion = profileCompletionStore((state) => state.setProfileCompletion);
  const setProfile = profileStore((state) => state.setProfile);
  const {user} = useAuth();
  
  const { data, error, isLoading } = useQuery<Profile | null, Error>({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  });

  const fields = [data?.name, data?.bio, data?.avatar_url];

  // number of fields filled  
  const filled = fields.filter((field) => field && field.trim() !== "").length;

  // percentage of completion
  const completion = Math.round((filled / fields.length) * 100);

  // color of progress bar


  useEffect(() => {
    setProfileCompletion(completion);
    if(user?.id === userId){
      setProfile(data);
    }
  }, [data, user]);

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
            className={`${isEditProfileOpen ? "opacity-0" : "block"} relative px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm cursor-pointer`}
          >
            {profileCompletion < 100 ? (
              <span className="absolute w-3 h-3 -left-1.5 -top-1.5 bg-red-600 rounded-full"></span>
            ) : null}
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

