import { useState } from 'react';
import { ProfileHeader } from './ProfileHeader';
import { StatsBar } from './StatusBar';
import { TabsNav } from './TabsNav';
import { UserPostItem } from './UserPostItem';
import { SuggestedSidebar } from './SuggestedSideBar';
import { CommunityCard } from './CommunityCard';
import { EditProfile } from './EditProfile';
import { editProfileStore } from './userProfileStore';
import { Toaster } from 'react-hot-toast';

// Single-file React component (Tailwind CSS required) that implements the wireframe
// - Default export: UserProfilePage
// - Contains subcomponents: ProfileHeader, StatsBar, TabsNav, PostItem, SuggestedSidebar
// - Uses placeholder data and minimal interactivity (tab switching)

interface Props{
    userId: string;
}

export const UserProfileDisplay = ({userId}: Props) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'media' | 'communities'>('posts');
  const isEditProfileOpen = editProfileStore((state) => state.isEditProfileOpen);

  const posts = [
    {
      id: 'p1',
      title: 'A neat post title',
      excerpt:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.',
      time: '2h',
    },
    {
      id: 'p2',
      title: 'Another post',
      excerpt: 'Suspendisse potenti. Nullam quis risus eget urna mollis ornare vel eu leo.',
      time: '1d',
    },
    {
      id: 'p3',
      title: 'Small update',
      excerpt: 'Curabitur blandit tempus porttitor. Maecenas sed diam eget risus varius blandit sit amet non magna.',
      time: '3d',
    },
    {
      id: 'p4',
      title: 'Small update',
      excerpt: 'Curabitur blandit tempus porttitor. Maecenas sed diam eget risus varius blandit sit amet non magna.',
      time: '3d',
    },
    {
      id: 'p5',
      title:'Small update',
      excerpt: 'Curabitur blandit tempus porttitor. Maecenas sed diam eget risus varius blandit sit amet non magna.',
      time: '3d',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileHeader userId={userId}/>
          <StatsBar />

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <TabsNav activeTab={activeTab} onChange={setActiveTab} />

            <div className="mt-4 space-y-4">
              {activeTab === 'posts' && (
                <div className="space-y-4">
                  {posts.map((p) => (
                    <UserPostItem key={p.id} post={p} />
                  ))}
                </div>
              )}

              {activeTab === 'replies' && (
                <div className="text-sm text-gray-600 ">No replies yet.</div>
              )}

              {activeTab === 'media' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="h-32 bg-gray-200" />
                  <div className="h-32 bg-gray-200" />
                  <div className="h-32 bg-gray-200" />
                </div>
              )}

              {activeTab === 'communities' && (
                <div className="space-y-2">
                  <CommunityCard name="React Devs" members={1200} />
                  <CommunityCard name="UI/UX" members={540} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <SuggestedSidebar />
          {isEditProfileOpen && <EditProfile/>}
        </aside>
      </div>
      <Toaster />
    </div>
  );
}

