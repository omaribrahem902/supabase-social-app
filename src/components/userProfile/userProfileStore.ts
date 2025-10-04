import { create } from "zustand";
import { supabase } from "../../supabase-client";
import type { Profile } from "../../Interfaces";

interface EditProfileStore{
    isEditProfileOpen: boolean;
    setIsEditProfileOpen: (isEditProfileOpen: boolean) => void;
}

const editProfileStore = create<EditProfileStore>((set) => ({
    isEditProfileOpen: false,
    setIsEditProfileOpen: (isEditProfileOpen: boolean) => set({ isEditProfileOpen }),
}))


interface ProfileCompletionStore{
    profileCompletion: number;
    setProfileCompletion: (profileCompletion: number) => void;
}

const profileCompletionStore = create<ProfileCompletionStore>((set) => ({
    profileCompletion: 0,
    setProfileCompletion: (profileCompletion: number) => set({ profileCompletion }),
}))

const fetchUser = async (userId: string) : Promise<Profile> => {
    const { data, error } = await supabase.from("Profiles").select("*").eq("id", userId);
    if (error) throw new Error(error.message);
    return data[0];
};

interface ProfileStore{
    profile: Profile | null | undefined;
    setProfile: (profile: Profile | null | undefined) => void;
}

const profileStore = create<ProfileStore>((set) => ({
    profile: null,
    setProfile: (profile: Profile | null | undefined) => set({ profile }),
}))


export {editProfileStore, profileCompletionStore, fetchUser,profileStore};
