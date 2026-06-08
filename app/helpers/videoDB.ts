export interface Video {
  id: number | string;
  video_url: string;
  user_id: number | string;
  username: string;
  uploaded_at: string;
}

export interface PendingVideo {
  id: number | string;
  video: string;
  uploadedAt: string;
}
