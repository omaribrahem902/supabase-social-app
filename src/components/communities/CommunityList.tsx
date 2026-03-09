import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase-client";
import { ErrorPage } from "../../pages/ErrorPage";
import type { Community } from "../../Interfaces";
import { Link } from "react-router";
import { SearchBar } from "../SearchBar";
import { Plus } from "lucide-react";
import { CommunityItem } from "./CommunityItem";
import { CommunitySkeleton } from "../skeletons/CommunitySkeleton";

export const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from("Communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Community[];
};

export const CommunityList = () => {
  const { data, error, isLoading } = useQuery<Community[], Error>({
    queryKey: ["Communities"],
    queryFn: fetchCommunities,
  });

  const totalCommunities = data?.length || 0;

  if (isLoading) {
    return <CommunitySkeleton count={3}/>
  }

  if (error) {
    return <ErrorPage message={error.message} />;
  }

  return (
    <div className="min-h-screen text-white px-2 lg:px-6 py-6 lg:py-10">

      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-center items-center gap-4">
          <h1 className="text-3xl lg:text-4xl font-bold">
            Your Communities
          </h1>

          <Link
            to="/community/create"
            className="flex items-center gap-2 px-2 lg:px-5 py-2 text-sm rounded-md bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition"
          >
            <Plus size={18} />
            Create Community
          </Link>
        </div>

        {/* Search */}
       <SearchBar type="communities"/>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          <StatCard title="Total Communities" value={totalCommunities.toString()} icon={null} />
          <StatCard title="Total Posts" value={"0"} icon={null} />
        </div>

        {/* Communities Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {data?.map((community) => (
            <CommunityItem key={community.id} community={community} />
          ))}

        </div>

      </div>
    </div>
  );
};


/* ======================= */
/* Stat Card Component */
/* ======================= */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl p-[1px] bg-gradient-to-br from-purple-500/40 to-blue-500/40">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="bg-purple-500/20 p-3 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}