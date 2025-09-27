import { useParams } from "react-router"
import { PostDetails } from "../components/posts/PostDetails"

export const PostPage = ()=>{
    const {id} = useParams<{id:string}>();
    return(
        <div className="mt-16">
            <PostDetails postId={Number(id)}/>
        </div>
    )
}