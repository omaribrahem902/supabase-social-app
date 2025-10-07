export interface Post {
    id: number;
    title: string;
    content: string;
    created_at: string;
    image_url: string;
    avatar_url?: string;
    like_count?: number;
    comment_count?: number;
    user_id: string | null;
    user_name: string | null;
}

export interface Community {
  id: number;
  created_at: string;
  name: string;
  description: string;
  user_id: string;
}

export interface Comment {
  id: number;
  post_id: number;
  parent_comment_id: number | null;
  content: string;
  user_id: string;
  created_at: string;
  author: string;
}

export interface NewComment {
    content: string;
    parent_comment_id?: number | null;
}

export interface Profile {
    id: string;
    created_at: string;
    name: string;
    bio: string;
    avatar_url: string | null;
    is_following: boolean;
}

export interface Follow{
    follower_id: string;
    following_id: string;
}

export interface ProfileStats{
  postsCount: number;
  communitiesCount: number;
  followersCount: number;
  followingCount: number;
}