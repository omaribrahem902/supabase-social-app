import { useState } from "react"
import { supabase } from "../supabase-client";
import {searchStore} from "./globalStates/global_state";

interface SearchBarProps {
    type: "posts" | "communities";
}

export const SearchBar = ({type}:SearchBarProps) => {
    const [searchQuery,setSearchQuery] = useState<string>("");
    const {setSearchPostResults,setSearchCommunityResults} = searchStore();
    
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        if(type === "posts") {
            const { data, error } = await supabase
          .rpc("get_posts_with_counts")
          .or(`title.ilike.%${searchQuery}%`);
        if (error) {
            console.error("Error searching posts:", error);
            return;
        }
        setSearchPostResults(data);
        console.log(data);
        }else {
            const { data, error } = await supabase
          .from("Communities")
          .select("*")
          .or(`name.ilike.%${searchQuery}%`);
        if (error) {
            console.error("Error searching communities:", error);
            return;
        }
        setSearchCommunityResults(data);
        }
    }
    return (
        <div className="flex justify-center items-center">
            <div className="flex items-center gap-2 border border-gray-300 bg-transparent mb-4 p-2 rounded-full">
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
              type="text" placeholder={`Search ${type}...`} className=" w-[200px] lg:w-[500px] outline-none" />
            </div>
        </div>
    );
};