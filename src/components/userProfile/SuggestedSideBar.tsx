import { SuggestedItem } from "./SuggestedItem";

export const SuggestedSidebar = () => {
  return (
    <aside className="">
      <div className="bg-white  rounded-2xl p-4 shadow-sm">
        <h4 className="font-semibold mb-3">Suggested Users / Communities</h4>
        <div className="space-y-3">
          <SuggestedItem name="Ali Ibrahim" desc="Frontend dev" />
          <SuggestedItem name="React Devs" desc="Community • 1.2k" />
          <SuggestedItem name="UI/UX" desc="Community • 540" />
        </div>
      </div>
    </aside>
  );
};
