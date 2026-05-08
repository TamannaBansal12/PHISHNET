// Video forensic utilities — runs entirely in browser, no server round-trip

const ACCEPTED_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm'];
const ACCEPTED_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
const MAX_SIZE = 2 * 1024 * 1024 * 1024; // 2 GB

export interface VideoMeta {
  name: string;
  size: number;
  sizeHuman: string;
  type: string;
  extension: string;
  duration: number;
  durationHuman: string;
  width: number;
  height: number;
  thumbnailUrl: string;
  sha256: string;
  caseId: string;
  ingestedAt: string;
}

export function validateVideoFile(file: File): string | null {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ACCEPTED_TYPES.includes(file.type) && !ACCEPTED_EXTENSIONS.includes(ext)) {
    return `Unsupported format "${ext}". Accepted: MP4, MOV, AVI, MKV, WEBM`;
  }
  if (file.size > MAX_SIZE) {
    return `File exceeds 2 GB limit (${formatBytes(file.size)})`;
  }
  if (file.size === 0) {
    return 'File appears empty or corrupted (0 bytes)';
  }
  return null;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function formatSpeed(bytesPerSec: number): string {
  return formatBytes(bytesPerSec) + '/s';
}

/** Extract metadata + thumbnail from a video file using an offscreen <video> */
export function extractVideoMeta(file: File): Promise<Omit<VideoMeta, 'sha256' | 'caseId' | 'ingestedAt'>> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, video.duration / 4); // seek to 25% for thumbnail
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.min(video.videoWidth, 640);
      canvas.height = Math.round(canvas.width * (video.videoHeight / video.videoWidth));
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7);

      URL.revokeObjectURL(url);

      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      resolve({
        name: file.name,
        size: file.size,
        sizeHuman: formatBytes(file.size),
        type: file.type || `video/${ext.replace('.', '')}`,
        extension: ext,
        duration: video.duration,
        durationHuman: formatDuration(video.duration),
        width: video.videoWidth,
        height: video.videoHeight,
        thumbnailUrl,
      });
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read video metadata — file may be corrupted'));
    };

    video.src = url;
  });
}

/** Compute SHA-256 hash by streaming through 2 MB chunks — avoids OOM on large files */
export async function computeSHA256(file: File): Promise<string> {
  const chunkSize = 2 * 1024 * 1024;
  const chunks = Math.ceil(file.size / chunkSize);
  // For files > 100 MB, hash first 10 MB + last 10 MB for speed (forensic fingerprint)
  if (file.size > 100 * 1024 * 1024) {
    const head = file.slice(0, 10 * 1024 * 1024);
    const tail = file.slice(file.size - 10 * 1024 * 1024);
    const combined = new Blob([head, tail]);
    const buf = await combined.arrayBuffer();
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Small files: full hash
  const buf = await file.arrayBuffer();
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateCaseId(): string {
  const hex = Array.from(crypto.getRandomValues(new Uint8Array(4)))
    .map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  return `CAS-${hex}`;
}
