import { useState } from 'react';
import { ProfileHeader } from './ProfileHeader';
import { StatsBar } from './StatusBar';
import { TabsNav } from './TabsNav';
import { SuggestedSidebar } from './SuggestedSideBar';
import { EditProfile } from './EditProfile';
import { editProfileStore } from './userProfileStore';
import { DisplayUserPosts } from './DisplayUserPosts';
import { DisplayUserCommunities } from './DisplayUserCommunities';
import { ProfileCompletion } from './ProfileCompletion';

interface Props{
    userId: string;
}

export const UserProfileDisplay = ({userId}: Props) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'communities'>('posts');
  const isEditProfileOpen = editProfileStore((state) => state.isEditProfileOpen);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileHeader userId={userId}/>
            <div className="block lg:hidden">
              <ProfileCompletion />
              {isEditProfileOpen && <EditProfile/>}
            </div>
          <StatsBar />

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <TabsNav activeTab={activeTab} onChange={setActiveTab} />

            <div className="mt-4 space-y-4">
              {activeTab === 'posts' && (
                <div className="space-y-4">
                  {<DisplayUserPosts userId={userId} />}
                </div>
                )
              }

              {activeTab === 'communities' && (
                <DisplayUserCommunities userId={userId} />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          <SuggestedSidebar />
          <div className="hidden lg:block">
            <ProfileCompletion />
            {isEditProfileOpen && <EditProfile/>}
          </div>
        </aside>
      </div>
    </div>
  );
}

