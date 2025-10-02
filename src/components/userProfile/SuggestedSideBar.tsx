import { SuggestedItem } from "./SuggestedItem";

export const SuggestedSidebar = () => {
    return (
      <aside className="space-y-4 sticky top-18">
        <div className="bg-white  rounded-2xl p-4 shadow-sm">
          <h4 className="font-semibold mb-3">Suggested Users / Communities</h4>
          <div className="space-y-3">
            <SuggestedItem name="Ali Ibrahim" desc="Frontend dev" />
            <SuggestedItem name="React Devs" desc="Community • 1.2k" />
            <SuggestedItem name="UI/UX" desc="Community • 540" />
          </div>
        </div>
  
        <div className="bg-white rounded-2xl mb-4 p-4 shadow-sm text-sm text-gray-600">
          <div className="font-semibold mb-2">Profile completion</div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-600 h-2 w-3/4" />
          </div>
          <div className="mt-2">Complete your profile to get better suggestions.</div>
        </div>
      </aside>
    );
  }