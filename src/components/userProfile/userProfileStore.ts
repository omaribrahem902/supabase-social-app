import { create } from "zustand";

interface EditProfileStore{
    isEditProfileOpen: boolean;
    setIsEditProfileOpen: (isEditProfileOpen: boolean) => void;
}

const editProfileStore = create<EditProfileStore>((set) => ({
    isEditProfileOpen: false,
    setIsEditProfileOpen: (isEditProfileOpen: boolean) => set({ isEditProfileOpen }),
}))



export {editProfileStore};
