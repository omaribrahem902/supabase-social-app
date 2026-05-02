import { useState, type FormEvent } from "react"
import { supabase } from "../../supabase-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import  toast,{ Toaster } from "react-hot-toast";

interface CommunityInput{
    name:string;
    description:string;
    user_id?: string | null;
}

const createCommunity = async(community:CommunityInput)=>{
    const {error,data} = await supabase.from("Communities").insert(community);
    if(error) throw new Error(error.message);
    return data;
}

export const CreateCommunity = ()=>{

   const [name, setName] = useState<string>("");
   const [description, setDescription] = useState<string>("");
   const {user} = useAuth();
   const queryClient = useQueryClient();

   const { mutate, isPending, isError } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Communities"] });
    },
  });

  const handleSubmit = (e:FormEvent) => {
    e.preventDefault();
    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            name,
            description,
            user_id: user?.id || null,
          },
          {
            onSuccess: () =>{ 
              resolve("done")
              setName("")
              setDescription("")
            },
            onError: (err) => reject(err),
          }
        );
      }),
      {
        loading: "Creating community...",
        success: "Community created successfully",
        error: "Error creating community",
      }
    );    
  };
    return (
  <div className="h-screen flex items-start justify-center bg-[#0F172A] px-4">

    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl relative rounded-3xl p-[1px] bg-gradient-to-br from-purple-500/40 via-blue-500/30 to-cyan-400/40"
    >
      {/* Glass Card */}
      <div className="rounded-xl lg:rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 space-y-6 shadow-2xl">

        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-xl lg:text-3xl font-bold text-white">
            Create New Community ✨
          </h2>
          <p className="text-gray-400 text-sm">
            Build your own space and start growing your audience.
          </p>
        </div>

        {/* Community Name */}
        <div className="space-y-2">
          <label className="text-sm text-gray-300">
            Community Name
          </label>

          <input
            type="text"
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter community name..."
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm text-gray-300">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your community..."
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none transition"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="lg:w-auto px-2  lg:px-6 py-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm lg:text-base font-medium hover:opacity-90 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isPending ? "Creating..." : "Create Community"}
          </button>
        </div>

        {isError && (
          <p className="text-red-400 text-sm text-center">
            Error creating community.
          </p>
        )}

      </div>

      <Toaster />
    </form>
  </div>
);
}