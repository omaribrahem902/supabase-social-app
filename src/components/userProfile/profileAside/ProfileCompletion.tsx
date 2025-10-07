import { profileCompletionStore } from "../userProfileStore";


export const ProfileCompletion = () => {
    const profileCompletion = profileCompletionStore((state) => state.profileCompletion);
      const progressColor =
        profileCompletion === 100? "bg-green-500 w-full"
          : profileCompletion >= 50? "bg-blue-600 w-2/3"
          : profileCompletion >= 25? "bg-yellow-400 w-1/3"
          : "bg-gray-400";
    return (
        <div className="bg-white rounded-2xl mb-4 p-4 shadow-sm text-sm text-gray-600">
        <div className="font-semibold mb-2">Profile completion</div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div className={`${progressColor} h-full`} />
        </div>
        <div className="mt-2">
          {profileCompletion === 100? "Profile is completed": "Complete your profile to get better suggestions."}
        </div>
      </div>
    )
}