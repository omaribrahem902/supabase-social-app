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
    [selectedFile, mutate, title, content, profile?.avatar_url, profile?.id, profile?.name, communityId]
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
  <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-2 lg:px-4">
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl relative rounded-3xl p-[1px] bg-gradient-to-br from-purple-500/40 via-cyan-400/30 to-blue-500/40"
    >
      {/* Glass Card */}
      <div className="rounded-xl lg:rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 lg:p-8 space-y-6 shadow-2xl">

        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-xl lg:text-3xl font-bold text-white">
            Create something amazing ✨
          </h2>
          <p className="text-gray-400 text-sm">
            Share your thoughts, media, and inspiration with your community.
          </p>
        </div>

        {/* Title */}
        <div>
          <input
            type="text"
            placeholder="Give your post a compelling title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-b border-white/20 text-white placeholder-gray-400 py-2 focus:outline-none focus:border-purple-400 transition"
            required
          />
        </div>

        {/* Content */}
        <div>
          <textarea
            placeholder="Write your content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            required
          />
        </div>

        {/* Image Upload */}
        <div className="border-2 border-dashed border-white/20 rounded-xl p-2 lg:p-6 text-center hover:border-purple-400 transition">
          <label
            htmlFor="image"
            className="cursor-pointer text-[12px] lg:text-[16px] text-gray-400 hover:text-white transition"
          >
            Click to upload an image.
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            required
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Community Select */}
        <div>
          <select
            onChange={handleCommunityChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option className='bg-[#0F172A]' value="">-- Choose a Community --</option>
            {communities?.map((community) => (
              <option className='bg-[#0F172A]' key={community.id} value={community.id}>
                {community.name}
              </option>
            ))}
          </select>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end pt-4">
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="px-2 lg:px-6 py-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-[12px] lg:text-[16px] hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
            >
              {isPending ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </div>

      </div>

      <Toaster />
    </form>
  </div>
);
};
