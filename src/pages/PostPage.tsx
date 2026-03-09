import { useParams } from "react-router"
import { PostDetails } from "../components/posts/PostDetails"

export const PostPage = ()=>{
    const {id} = useParams<{id:string}>();
    return(
            <PostDetails postId={Number(id)}/>
    )
}