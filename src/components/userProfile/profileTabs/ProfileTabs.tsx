import { DisplayUserPosts } from "./DisplayProfilePosts"
import { DisplayUserCommunities } from "./DisplayUserCommunities"
import { DisplayUserFollowing } from "./DisplayUserFollowing"
import { TabsNav } from "./TabsNav"
import { useState } from "react"

export const ProfileTabs = ({profileId}: {profileId: string}) => {
    const [activeTab, setActiveTab] = useState<'posts' | 'communities' | 'following'>('posts');
    const handleTabChange = (tab: 'posts' | 'communities' | 'following') => {
        setActiveTab(tab);
    }
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
         <TabsNav activeTab={activeTab} onChange={handleTabChange} />
         <div className="mt-4 space-y-4">
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {<DisplayUserPosts profileId={profileId} />}
            </div>
            )
          }

          {activeTab === 'communities' && (
            <DisplayUserCommunities profileId={profileId} />
          )}
          {activeTab === 'following' && (
            <DisplayUserFollowing profileId={profileId} />
          )}
         </div>
        </div>
    )
}