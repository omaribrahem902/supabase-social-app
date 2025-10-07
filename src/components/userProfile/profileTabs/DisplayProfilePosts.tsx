import { useQuery } from "@tanstack/react-query"
import { supabase } from "../../../supabase-client"
import type { Post } from "../../../Interfaces";
import { ErrorPage } from "../../../pages/ErrorPage";
import { ProfilePostSkeleton } from "../../skeletons/profileSkeletons/ProfilePostSkeleton";
import { ProfilePostItem } from "./ProfilePostItem";

interface Props{
    profileId: string;
}

async function fetchUserPosts(userId: string) : Promise<Post[]> {
    const {data, error} = await supabase.from('Posts').select('id, title, content, created_at').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data as Post[];
}

export const DisplayUserPosts = ({profileId}: Props) => {
    const {data: posts, error, isLoading} = useQuery<Post[], Error>({
        queryKey: ['profilePosts', profileId],
        queryFn: () => fetchUserPosts(profileId)

    })
    if(isLoading){
        return(
            <div className="flex flex-col gap-3 justify-center">
                {Array.from({ length: 3 }).map((_, i) => (
                    <ProfilePostSkeleton key={i} />
                ))}
            </div>
        )
    }
    if(error){
        return <ErrorPage message={error.message} />
    }
    return(
        <>
        {posts?.length === 0 ? (<p>Not created any posts yet</p>):(
            <div className="flex flex-col gap-2">
            {posts?.map((p: Post) => (
                <ProfilePostItem key={p.id} post={p} />
            ))}
        </div>
        )} 
        </>
    )
}