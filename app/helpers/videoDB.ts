const DB_NAME = "videosDB";
const DB_VERSION = 1;
const PENDING_STORE = "pendingVideos";
const APPROVED_STORE = "approvedVideos";

export interface PendingVideo {
  id: number | string;
  file: Blob;
  uploadedAt: string;
}

export interface ApprovedVideo {
  id: number | string;
  file: Blob;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(PENDING_STORE)) {
        db.createObjectStore(PENDING_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(APPROVED_STORE)) {
        db.createObjectStore(APPROVED_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function addPendingVideo(video: PendingVideo): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDING_STORE, "readwrite");
    tx.objectStore(PENDING_STORE).put(video);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPendingVideos(): Promise<PendingVideo[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDING_STORE, "readonly");
    const request = tx.objectStore(PENDING_STORE).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deletePendingVideo(id: number | string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDING_STORE, "readwrite");
    tx.objectStore(PENDING_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function addApprovedVideo(video: ApprovedVideo): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(APPROVED_STORE, "readwrite");
    tx.objectStore(APPROVED_STORE).put(video);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getApprovedVideos(): Promise<ApprovedVideo[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(APPROVED_STORE, "readonly");
    const request = tx.objectStore(APPROVED_STORE).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
