import { useParams } from "react-router"
import { UserProfileDisplay } from "../components/userProfile/UserProfileDisplay"

export const UserProfilePage = ()=>{
  const {id} = useParams<{id:string|undefined}>();
  return(
      <div>
          <UserProfileDisplay userId={id || ""}/>
      </div>
  )
}