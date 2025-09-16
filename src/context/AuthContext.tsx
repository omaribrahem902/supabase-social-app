import type { User } from "@supabase/supabase-js";
import {createContext, useContext,useEffect, useState, type ReactNode } from "react";
import { supabase } from "../supabase-client";

interface AuthContextType{
    user: User|null;
    signInWithGitHub: ()=> void;
    signOut: ()=>void;
}

const AuthContext = createContext<AuthContextType|undefined>(undefined);

export const AuthProvider = ({children}:{children:ReactNode})=>{
    const [user,setUser] = useState<User|null>(null);

    useEffect(() => {
        const getSession = async () => {
          const { data: { session } } = await supabase.auth.getSession();
          setUser(session?.user ?? null);
        };
        getSession();

        const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
          })
          return () => subscription.unsubscribe()
      }, []);
      

    const signInWithGitHub = ()=>{
        supabase.auth.signInWithOAuth({provider:"github"});
    }

    const signOut = ()=>{
        supabase.auth.signOut();
    }
   

    return(
        <AuthContext.Provider value={{user,signInWithGitHub,signOut}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType =>{
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new Error (" useAuth must be within the AuthProvider");
    }
    return context;
}