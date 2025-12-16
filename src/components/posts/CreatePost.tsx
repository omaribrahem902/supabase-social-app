import '../../index.css'
import { useCallback, useState, type ChangeEvent, type FormEvent } from "react"
import { supabase } from "../../supabase-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from '../../context/AuthContext';
import { fetchCommunities } from '../communities/CommunityList';
import type { Community } from "../../Interfaces";
import toast , {Toaster} from 'react-hot-toast';
import { getPublicProfile } from '../userProfile/userProfileStore';

interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
  community_id: number | null;
  user_id: string | null;
  user_name: string | null;
}

const createPost = async (post: PostInput, imageFile: File) => {

  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;
  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError?.message);

  const { data: publicURLData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from('Posts')
    .insert({ ...post, image_url: publicURLData.publicUrl });

  if (error) throw new Error(error.message);

  return data;
};

export const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [communityId, setCommunityId] = useState<number | null>(null);
  const { user } = useAuth();
  
  const {data: profile} = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getPublicProfile(user?.id || ""),
  });

  const { data: communities } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,

  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile);
    },
  });

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!selectedFile) return;

      toast.promise(
        new Promise((resolve, reject) => {
          mutate(
            {
              post: {
                title,
                content,
                avatar_url: profile?.avatar_url || null,
                community_id: communityId,
                user_id: profile?.id || null,
                user_name: profile?.name || null,
              },
              imageFile: selectedFile,
            },
            {
              onSuccess: () => {
                resolve("done");
                setTitle("");
                setContent("");
                setSelectedFile(null);
                setCommunityId(null);
              },
              onError: (err) => reject(err),
            }
          );
        }),
        {
          loading: "Creating post...",
          success: "Post created successfully",
          error: "Failed to create post",
        }
      );
    },
    [title, content, selectedFile, communityId, user, mutate]
  );

  const handleCommunityChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCommunityId(value ? Number(value) : null);
  }, []);

const MAX_FILE_SIZE_MB = 2;
const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    const fileSizeMB = file.size / 1024 / 1024;

    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      toast.error(`Image size must be less than 2MB  ${MAX_FILE_SIZE_MB}MB`);
      e.target.value = '';   
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  }
}, []);


  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block mb-2 font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 bg-transparent p-2 rounded"
          required
        />
      </div>

      {/* Content */}
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

      {/* Communities */}
      <div>
        <label>Select Community</label>
        <select id="community" onChange={handleCommunityChange}>
          <option value={""}> -- Choose a Community -- </option>
          {communities?.map((community, key) => (
            <option key={key} value={community.id}>
              {community.name}
            </option>
          ))}
        </select>
      </div>

      {/* Image Upload */}
      <div>
        <label
          htmlFor="image"
          className="block mb-2 font-medium cursor-pointer"
        >
          Upload Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          required
          onChange={handleFileChange}
          className="w-fit text-gray-400 cursor-pointer"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="text-[12px] lg:text-[16px] flex justify-center bg-purple-500 disabled:bg-purple-200 text-white px-4 py-2 rounded disabled:cursor-not-allowed cursor-pointer"
        disabled={isPending}
      >
        Create Post
      </button>
      <Toaster/>
    </form>
  );
};
