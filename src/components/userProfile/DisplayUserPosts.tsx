import { UserPostItem } from "./UserPostItem"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "../../supabase-client"
import type { Post } from "../../Interfaces";
import { ErrorPage } from "../../pages/ErrorPage";
import { UserPostSkeleton } from "../skeletons/UserPostSkeleton";

interface Props{
    userId: string;
}

async function fetchUserPosts(userId: string) : Promise<Post[]> {
    const {data, error} = await supabase.from('Posts').select('id, title, content, created_at').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data as Post[];
}

export const DisplayUserPosts = ({userId}: Props) => {
    const {data: posts, error, isLoading} = useQuery<Post[], Error>({
        queryKey: ['userPosts', userId],
        queryFn: () => fetchUserPosts(userId)

    })
    if(isLoading){
        return(
            <div className="flex flex-col gap-3 justify-center">
                {Array.from({ length: 3 }).map((_, i) => (
                    <UserPostSkeleton key={i} />
                ))}
            </div>
        )
    }
    if(error){
        return <ErrorPage message={error.message} />
    }
    return(
        <div className="flex flex-col gap-2">
            {posts?.map((p: Post) => (
                <UserPostItem key={p.id} post={p} />
            ))}
        </div>
    )
}