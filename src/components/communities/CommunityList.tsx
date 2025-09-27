import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase-client";
import { Link, useNavigate } from "react-router";
import { DeleteModal } from "../DeleteModal";
import { useState } from "react";
import { CommunitySkeleton } from "../skeletons/CommunitySkeleton";

export interface Community {
  id: number;
  created_at: string;
  name: string;
  description: string;
}

export const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from("Communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data as Community[];
};

export const CommunityList = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useQuery<Community[], Error>({
    queryKey: ["Communities"],
    queryFn: fetchCommunities,
  });

  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null
  );
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 justify-center">
        {Array.from({ length: 3 }).map((_, i) => (
          <CommunitySkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  async function handleDeleteCommunity(communityId: number): Promise<void> {
    const { error } = await supabase
      .from("Communities")
      .delete()
      .eq("id", communityId);
    if (error) throw new Error(error.message);
    navigate("/");
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {data?.map((community) => (
        <div
          key={community.id}
          className="border border-gray-400 shadow-2xs hover:shadow-md shadow-neutral-400 py-2 lg:py-4 px-2 lg:px-7 rounded-xl lg:rounded-2xl hover:-translate-y-1 transition transform"
        >
          <div className="flex justify-between items-center">
            <div>
              <Link
                to={`/communities/${community.id}`}
                className="text-lg lg:text-2xl font-bold text-purple-500 hover:underline"
              >
                {community.name}
              </Link>
              <p className="text-gray-400 mt-2 text-xs lg:text-sm">
                {community.description}
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedCommunity(community);
                setOpen(true);
              }}
              className="bg-red-600 text-white rounded-md py-1 px-3 cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      {/* Global Delete Modal */}
      {selectedCommunity && (
        <DeleteModal
          onConfirm={() => handleDeleteCommunity(selectedCommunity.id)}
          open={open}
          setOpen={setOpen}
          title="Are you sure you want to delete this community?"
          description={`This will permanently delete "${selectedCommunity.name}" and all its posts.`}
        />
      )}
    </div>
  );
};
