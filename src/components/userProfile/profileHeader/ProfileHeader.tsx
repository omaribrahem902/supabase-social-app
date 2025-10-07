import {
  editProfileStore,
  profileCompletionStore,
  profileStore,
} from "../userProfileStore";
import type { Profile } from "../../../Interfaces";
import { useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { FollowBtn } from "./FollowBtn";
interface Props {
  profile: Profile | null | undefined;
}

export const ProfileHeader = ({ profile }: Props) => {
  const isEditProfileOpen = editProfileStore(
    (state) => state.isEditProfileOpen
  );
  const setIsEditProfileOpen = editProfileStore(
    (state) => state.setIsEditProfileOpen
  );
  const profileCompletion = profileCompletionStore(
    (state) => state.profileCompletion
  );
  const setProfileCompletion = profileCompletionStore(
    (state) => state.setProfileCompletion
  );
  const setProfile = profileStore((state) => state.setProfile);
  const { user } = useAuth();


  const fields = [profile?.name, profile?.bio, profile?.avatar_url];

  // number of fields filled
  const filled = fields.filter((field) => field && field.trim() !== "").length;

  // percentage of completion
  const completion = Math.round((filled / fields.length) * 100);

  useEffect(() => {
    setProfileCompletion(completion);
    if (user?.id === profile?.id) {
      setProfile(profile);
    }
  }, [profile, user]);

  const handleEditBtnClick = () => {
    setIsEditProfileOpen(true);
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    if (isMobile) {
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          {profile?.avatar_url ? (
            <img
              className="rounded-full w-28 h-28"
              src={profile.avatar_url}
              alt="Profile"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-200 border border-gray-300" />
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{profile?.name}</h2>
          <p className="mt-3 text-sm text-gray-700">{profile?.bio}</p>
        </div>

        <div className="flex flex-col justify-between gap-2 md:gap-0">
          {user?.id === profile?.id && (
            <button
              onClick={handleEditBtnClick}
              className={`${
                isEditProfileOpen ? "opacity-0" : "block"
              } relative px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 shadow text-sm cursor-pointer`}
            >
              {profileCompletion < 100 ? (
                <span className="absolute w-3 h-3 -left-1.5 -top-1.5 bg-red-600 rounded-full"></span>
              ) : null}
              Edit Profile
            </button>
          )}
          {profile && <FollowBtn profileData={profile} />}
        </div>
      </div>
    </div>
  );
};
