import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase-client";
import { CommunitySkeleton } from "../skeletons/CommunitySkeleton";
import { ErrorPage } from "../../pages/ErrorPage";
import { CommunityItem } from "./CommunityItem";
import type { Community } from "../../Interfaces";

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
    return <ErrorPage message={error.message} />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {data?.map((community) => (
        <CommunityItem community={community} key={community.id} />
      ))}
    </div>
  );
};
