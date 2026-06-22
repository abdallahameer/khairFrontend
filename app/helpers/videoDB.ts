export interface Video {
  id: number | string;
  video?: string;
  video_url: string;
  username: string;
  user_id: string;
  uploaded_at: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  saves_count: number;
  is_liked: number;
  is_saved: number;
  profile_image: string;
}

export interface PendingVideo {
  id: number | string;
  video: string;
  uploadedAt: string;
}

export interface UserProfileType {
  user: {
    id: string;
    username: string;
    created_at: string;
    profile_image: string | null;
  };
  videos: {
    id: string;
    video_url: string;
    uploaded_at: string;
    likes_count: number;
    comments_count: number;
    views_count: number;
    saves_count: number;
    is_liked: number;
    is_saved: number;
  }[];
}

export interface VideoItem {
  id: string;
  video_url: string;
  uploaded_at: string;
  username?: string;
  user_id?: string;
}
