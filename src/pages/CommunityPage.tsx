import { useParams } from "react-router"
import { CommunityDisplay } from "../components/communities/CommunityDisplay";

export const CommunityPage = ()=>{
    const {id} = useParams<{id:string}>();
    return(
        <div>
            <CommunityDisplay communityId={Number(id)} />
        </div>
    )
}