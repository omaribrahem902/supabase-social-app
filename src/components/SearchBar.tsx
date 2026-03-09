import { useState } from "react"
import { supabase } from "../supabase-client";
import {searchStore} from "./globalStates/global_state";

interface SearchBarProps {
    type: "posts" | "communities";
}

export const SearchBar = ({type}:SearchBarProps) => {
    const [searchQuery,setSearchQuery] = useState<string>("");
    const setSearchPostResults = searchStore((state) => state.setSearchPostResults);
    const setSearchCommunityResults = searchStore((state) => state.setSearchCommunityResults);
    
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        if(type === "posts") {
            const { data, error } = await supabase
          .rpc("get_posts_with_counts")
          .or(`title.ilike.%${searchQuery}%`);
        if (error) {
            throw new Error(error.message);
        }
        setSearchPostResults(data);
        }else {
            const { data, error } = await supabase
          .from("Communities")
          .select("*")
          .or(`name.ilike.%${searchQuery}%`);
        if (error) {
            throw new Error(error.message);
        }
        setSearchCommunityResults(data);
        }
    }
    return (
        <div className="flex justify-center items-center">
            <div className=" mb-4 p-2 flex items-center gap-3 
                  w-full max-w-2xl 
                  bg-white/10 
                  backdrop-blur-xl
                  border border-white/10 
                  rounded-full 
                  px-4 py-2 lg:px-6 lg:py-4
                  shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Search">
                    <title>Search</title>
                    <circle cx="11" cy="11" r="7"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value === "") {
                    setSearchPostResults([]);
                    setSearchCommunityResults([]);
                  }
              }}
              onKeyDown={(e) => {if(e.key === "Enter") {
                handleSearch();
              }}}
              type="text" placeholder={`Search ${type}...`} className=" w-[200px] lg:w-[500px] outline-none bg-transparent" />
            </div>
        </div>
    );
};