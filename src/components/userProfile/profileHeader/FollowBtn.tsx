import { useAuth } from "../../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../supabase-client";
import type { Profile } from "../../../Interfaces";

interface Props {
    profileData: Profile;
    variant?: "sm" | "lg";
}

export const FollowBtn = ({profileData, variant}: Props) => {
    const {user} = useAuth();
    const queryClient = useQueryClient();

    const playNotificationSound = () => {
        const audio = new Audio("/sounds/follow-notification.mp3");
        audio.volume = 1;
        audio.play().catch(() => {});
      };

    const handleFollow = async (profileId: string) => {
        const { data, error } = await supabase
          .from('Follows')
          .insert({ follower_id: user?.id, following_id: profileId })
    
        if (error) throw new Error(error.message);
        playNotificationSound(); 
        await queryClient.invalidateQueries({ queryKey: ["profile", profileId] });
        return data;
      };
    
      const handleUnfollow = async (profileId: string) => {
        const { data, error } = await supabase
          .from('Follows')
          .delete()
          .eq('follower_id', user?.id)
          .eq('following_id', profileId)
    
        if (error) throw new Error(error.message);
        await queryClient.invalidateQueries({ queryKey: ["profile", profileId] });
        return data;
      }; 
    return (
        <>
        {user?.id !== profileData.id && (
            <>
              {(profileData?.is_following) ? (
                <button
                  onClick={() => handleUnfollow(profileData.id)}
                  className={`${variant ==="sm" ? "px-2 py-1 text-xs":"px-4 py-2 text-sm"} bg-black rounded-md text-white cursor-pointer`}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={() => handleFollow(profileData.id)}
                  className={`${variant ==="sm" ? "px-2 py-1 text-xs":"px-4 py-2 text-sm"} bg-blue-600 rounded-md text-white cursor-pointer`}
                >
                  Follow
                </button>
              )}
            </>
          )}
        </>
    )
}