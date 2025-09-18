import { useState, type FormEvent } from "react"
import { supabase } from "../supabase-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

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
   const navigate = useNavigate();
   const queryClient = useQueryClient();

   const { mutate, isPending, isError } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Communities"] });
      navigate("/communities");
    },
  });

  const handleSubmit = (e:FormEvent) => {
    e.preventDefault();
    mutate({ name,description,user_id: user?.id || null });
  };
    return(
         <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-3xl lg:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Create New Community
      </h2>
      <div>
        <label htmlFor="name" className="block mb-2 font-medium">
          Community Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-400 bg-transparent p-2 rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block mb-2 font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-400 bg-transparent p-2 rounded"
          rows={3}
        />
      </div>
      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        {isPending ? (<span className="loader"></span>) : "Create Community"}
      </button>
      {isError && <p className="text-red-500">Error creating community.</p>}
    </form>
    )
}