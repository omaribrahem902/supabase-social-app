import { SuggestedSidebar } from "./SuggestedSideBar";
import { ProfileCompletion } from "./ProfileCompletion";
import { editProfileStore } from "../userProfileStore";
import { EditProfile } from "./EditProfile";

export const ProfileAside = ({profileId, profileBio}: {profileId: string, profileBio: string}) => {
    const isEditProfileOpen = editProfileStore((state) => state.isEditProfileOpen);
    return (
        <aside className="flex flex-col gap-4">
          <SuggestedSidebar profileId={profileId} profileBio={profileBio}/>
          <div>
            <ProfileCompletion />
            {isEditProfileOpen && <EditProfile/>}
          </div>
        </aside>
    )
}