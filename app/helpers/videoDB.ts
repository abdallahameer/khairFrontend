export interface Video {
  id: number | string;
  video: string;
}

export interface PendingVideo {
  id: number | string;
  video: string;
  uploadedAt: string;
}
