import '../index.css'
import { useState, type ChangeEvent, type FormEvent } from "react"
import { supabase } from "../supabase-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from '../context/AuthContext';
import { fetchCommunities, type Community } from './CommunityList';

interface PostInput{
    title:string;
    content:string;
    avatar_url:string | null;
    community_id:number | null;
    user_id: string | null;
}

const createPost = async (post:PostInput, imageFile: File)=>{
    
    const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;
    const {error: uploadError} = await supabase.storage.from("post-images").upload(filePath,imageFile);
    
    
    if(uploadError) throw new Error (uploadError?.message);
    
    const {data: publicURLData} = supabase.storage.from("post-images").getPublicUrl(filePath)
    const { data, error } = await supabase.from('Posts').insert({...post,image_url: publicURLData.publicUrl})
    
    if (error) throw new Error(error.message);
    
    return data
  }
  
  export const CreatePost = ()=>{
    const [title,setTitle] = useState<string>(""); 
    const [content,setContent] = useState<string>("");
    const [selectedFile,setSelectedFile] = useState<File | null>(null);
    const [communityId,setCommunityId] = useState<number | null>(null);
    const {user} = useAuth(); 

    const { data: communities } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

    const {mutate, isError,isPending} = useMutation({mutationFn: (data: {post:PostInput; imageFile:File})=>{
       return createPost(data.post,data.imageFile);
    }});

    const  handleSubmit = async (e:FormEvent)=>{
        e.preventDefault();
        if(selectedFile)
        mutate({
          post:{title,
                content,
                avatar_url: user?.user_metadata.avatar_url || null,
                community_id: communityId,
                user_id: user?.id || null,
              },
                imageFile:selectedFile});
        else return;
    }

    const handleCommunityChange = (e:ChangeEvent<HTMLSelectElement>)=>{
      const value = e.target.value;
       setCommunityId(value? Number(value): null);
    }

    const handleFileChange = (e:ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files && e.target.files[0]){
            setSelectedFile(e.target.files[0]);
        }
    }

    return(
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2 font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 bg-transparent p-2 rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="content" className="block mb-2 font-medium">
          Content
        </label>
        <textarea
          
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 bg-transparent p-2 rounded"
          rows={5}
          required
          
        />
      </div>

      <div>
        <label> Select Community</label>
        <select id="community" onChange={handleCommunityChange}>
          <option value={""}> -- Choose a Community -- </option>
          {communities?.map((community, key) => (
            <option key={key} value={community.id}>
              {community.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="image" className="block mb-2 font-medium cursor-pointer">
          Upload Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-fit text-gray-200 cursor-pointer"
          
        />
      </div>
      <button
        type="submit"
        className="w-[113px] flex justify-center bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        {isPending ? (<span className="loader"></span>) : "Create Post"}
      </button>

      {isError && <p className="text-red-500"> Error creating post.</p>}
    </form>
    )
}