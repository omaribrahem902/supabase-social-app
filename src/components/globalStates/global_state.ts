import { create } from 'zustand'
import type { Post } from '../../Interfaces'
import type { Community } from '../../Interfaces';

interface SearchStore {
    searchPostResults: Post[];
    setSearchPostResults: (searchPostResults: Post[]) => void;
    searchCommunityResults: Community[];
    setSearchCommunityResults: (searchCommunityResults: Community[]) => void;
}

interface SelectedCommunityStore{
    selectedCommunity: Community | null;
    setSelectedCommunity: (selectedCommunity: Community | null) => void;
}

interface ToggleDeleteModalStore{
    open: boolean;
    setOpen: (open: boolean) => void;
}

const searchStore = create<SearchStore>((set) => ({
  searchPostResults: [],
  setSearchPostResults: (searchPostResults : Post[]) => set({ searchPostResults }),
  searchCommunityResults: [],
  setSearchCommunityResults: (searchCommunityResults : Community[]) => set({ searchCommunityResults }),
}))

const selectedCommunityStore = create<SelectedCommunityStore>((set) => ({
  selectedCommunity: null,
  setSelectedCommunity: (selectedCommunity: Community | null) => set({ selectedCommunity }),
}))

const toggleDeleteModalStore = create<ToggleDeleteModalStore>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
}))

export {searchStore, selectedCommunityStore,toggleDeleteModalStore};