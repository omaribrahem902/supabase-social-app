import '../../../index.css' 
import { useState, type ChangeEvent, type FormEvent } from "react" 
import { supabase } from "../../../supabase-client"; 
import { useMutation } from "@tanstack/react-query"; 
import { useAuth } from '../../../context/AuthContext'; 
import toast from 'react-hot-toast'; 
import { editProfileStore, profileCompletionStore } from "../userProfileStore"; 

interface EditProfileInput { 
  name: string; 
  bio: string;   
} 

const editProfile = async (profile: EditProfileInput, imageFile: File | null, user_id: string) => { 
  let avatar_url;

  if(imageFile){
  const filePath = `${Date.now()}-${imageFile.name}`; 
  const { error: uploadError } = await supabase.storage 
    .from("profile-avatars") 
    .upload(filePath, imageFile); 

  if (uploadError) throw new Error(uploadError?.message); 

  const { data: publicURLData } = supabase.storage 
    .from("profile-avatars") 
    .getPublicUrl(filePath); 

    avatar_url = publicURLData.publicUrl;

    const { data, error } = await supabase 
    .from('Profiles') 
    .update({ ...profile, avatar_url})
    .eq('id', user_id);

    if (error) throw new Error(error.message); 

    return data;
  }else{
    const { data, error } = await supabase 
    .from('Profiles') 
    .update({ ...profile})
    .eq('id', user_id);

    if (error) throw new Error(error.message); 

    return data;
  }
   

   
}; 

export const EditProfile = () => { 
  const [name, setName] = useState<string>(""); 
  const [bio, setBio] = useState<string>(""); 
  const [selectedFile, setSelectedFile] = useState<File | null>(null); 
  const setIsEditProfileOpen = editProfileStore((state) => state.setIsEditProfileOpen); 
  const setProfileCompletion = profileCompletionStore((state) => state.setProfileCompletion);
  const { user } = useAuth(); 

  const { mutate, isPending } = useMutation({ 
    mutationFn: (data: { profile: EditProfileInput; imageFile: File | null }) => { 
      return editProfile(data.profile, data.imageFile, user?.user_metadata.user_id || user?.id || ""); 
    }, 
  }); 

  const handleSubmit = (e: FormEvent) => { 
    e.preventDefault(); 
      toast.promise( 
        new Promise((resolve, reject) => { 
          mutate( 
            { 
              profile: { 
                name, 
                bio, 
              }, 
              imageFile: selectedFile, 
            }, 
            { 
              onSuccess: () => { 
                resolve("done") 
                setName("") 
                setBio("") 
                setSelectedFile(null) 
                setIsEditProfileOpen(false) 
                setProfileCompletion(100);
              }, 
              onError: (err) => reject(err), 
            } 
          ); 
        }), 
        { 
          loading: "Editing profile...", 
          success: "Profile edited successfully", 
          error: "Failed to edit profile", 
        } 
      ); 
  }; 

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => { 
    if (e.target.files && e.target.files[0]) { 
      setSelectedFile(e.target.files[0]); 
    } 
  }; 

  return ( 
    <aside className="sticky top-[500px]">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-3">
          <div>
            <label htmlFor="NameDesktop" className="block mb-1 font-medium">
              Name
            </label>
            <input
              type="text"
              id="NameDesktop"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-8 border border-gray-300 bg-transparent p-2 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="bioDesktop" className="block mb-1 font-medium">
              Bio
            </label>
            <textarea
              id="bioDesktop"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border border-gray-300 bg-transparent p-2 rounded"
              rows={2}
            />
          </div>

          <div>
            <label
              htmlFor="imageDesktop"
              className="block font-medium cursor-pointer"
            >
              Upload Image
            </label>
            <input
              type="file"
              id="imageDesktop"
              accept="image/*"
              onChange={handleFileChange}
              className="w-fit text-gray-400 cursor-pointer"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(false)}
              className="bg-gray-200 px-4 py-2 rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-500 disabled:bg-purple-200 text-white px-4 py-2 rounded disabled:cursor-not-allowed cursor-pointer"
              disabled={isPending || (!name && !bio && !selectedFile)}
            >
              Save
            </button>
          </div>
        </form>
      </div>
</aside>
); 
};
