import { ProfileHeader } from './profileHeader/ProfileHeader';
import { StatsBar } from './profileStats/StatusBar';
import { ProfileTabs } from './profileTabs/ProfileTabs';
import { ProfileAside } from './profileAside/ProfileAside';
import { useQuery } from "@tanstack/react-query";
import type { Profile } from "../../Interfaces";
import { getPublicProfile } from "./userProfileStore";
import { ErrorPage } from '../../pages/ErrorPage';
import { useAuth } from '../../context/AuthContext';
import SpinnerLoader from '../SpinnerLoader';
interface Props{
  profileId: string;
}

export const UserProfileDisplay = ({profileId}: Props) => {
  const {user} = useAuth();
  const { data, error, isLoading } = useQuery<Profile | null, Error>({
    queryKey: ["profile", profileId],
    queryFn: () => getPublicProfile(profileId),
  });
  
  if(isLoading){
    return(
      <div className='min-h-screen flex justify-center items-center'>

        <SpinnerLoader  />
      </div>
    )
  }
  if(error){
    return (
      <ErrorPage/>
    );
  }
  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      <div className={`max-w-6xl mx-auto grid grid-cols-1 ${user?.id === profileId ? "lg:grid-cols-3" : "lg:grid-cols-2"} gap-6`}>
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileHeader profile={data}/>
          <StatsBar profileId={data?.id || ""} />
          <ProfileTabs profileId={data?.id || ""} />
        </div>

        {/* Sidebar */}
        {user?.id === profileId && <ProfileAside profileId={data?.id || ""} profileBio={data?.bio || ""} />}
      </div>
    </div>
  );
}

