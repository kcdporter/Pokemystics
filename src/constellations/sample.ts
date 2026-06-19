/* Sample a Pokémon sprite into a set of constellation points.

   Loads /mons/<dex>.png, draws it into an offscreen canvas at low resolution,
   then picks one random opaque pixel per grid cell. The result is N normalized
   points in [0, 1] for both axes, sized to the silhouette's bounding box. */

export interface ConstellationPoint {
  x: number;
  y: number;
}

interface CachedResult {
  points: ConstellationPoint[];
  /** Pairs of point indices that form the constellation skeleton (MST). */
  edges: Array<[number, number]>;
  aspect: number; // width / height of the silhouette bounding box
}

const cache = new Map<number, Promise<CachedResult>>();

const SAMPLE_W = 96;
const SAMPLE_H = 96;
const ALPHA_THRESHOLD = 80;

export function getConstellation(dex: number, targetPoints = 28): Promise<CachedResult> {
  const key = dex * 1000 + targetPoints;
  const existing = cache.get(key);
  if (existing) return existing;
  const job = loadAndSample(dex, targetPoints);
  cache.set(key, job);
  // drop cache on rejection so a retry can happen
  job.catch(() => cache.delete(key));
  return job;
}

async function loadAndSample(dex: number, targetPoints: number): Promise<CachedResult> {
  const img = await loadImage(`/mons/${dex}.png`);
  const canvas = document.createElement("canvas");
  canvas.width = SAMPLE_W;
  canvas.height = SAMPLE_H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("canvas 2d unsupported");
  ctx.drawImage(img, 0, 0, SAMPLE_W, SAMPLE_H);
  const { data } = ctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H);

  const opaque: { x: number; y: number }[] = [];
  let minX = SAMPLE_W;
  let minY = SAMPLE_H;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < SAMPLE_H; y++) {
    for (let x = 0; x < SAMPLE_W; x++) {
      const a = data[(y * SAMPLE_W + x) * 4 + 3];
      if (a > ALPHA_THRESHOLD) {
        opaque.push({ x, y });
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (opaque.length === 0) return { points: [], edges: [], aspect: 1 };

  // grid-bucketed sampling: pick one random opaque pixel per cell for even spread
  const gridSize = Math.max(5, Math.ceil(Math.sqrt(targetPoints * 1.7)));
  const bbW = maxX - minX + 1;
  const bbH = maxY - minY + 1;
  const cellW = bbW / gridSize;
  const cellH = bbH / gridSize;
  shuffle(opaque);
  const buckets = new Map<string, { x: number; y: number }>();
  for (const p of opaque) {
    const gx = Math.floor((p.x - minX) / cellW);
    const gy = Math.floor((p.y - minY) / cellH);
    const key = `${gx},${gy}`;
    if (!buckets.has(key)) buckets.set(key, p);
  }
  const points = Array.from(buckets.values());
  shuffle(points);
  const kept = points.slice(0, targetPoints);
  const normalized: ConstellationPoint[] = kept.map((p) => ({
    x: (p.x - minX) / bbW,
    y: (p.y - minY) / bbH,
  }));
  const edges = computeMST(normalized);
  return { points: normalized, edges, aspect: bbW / bbH };
}

/* Prim's minimum spanning tree over the points in 2D. Returns N-1 edges as
   index pairs; edges that span more than MAX_EDGE_LEN of the normalized box
   are dropped so the constellation reads as a few connected groups rather
   than a single long zigzag. */
function computeMST(points: ConstellationPoint[]): Array<[number, number]> {
  const n = points.length;
  if (n < 2) return [];
  const MAX_EDGE_LEN_SQ = 0.32 * 0.32;
  const inTree = new Array<boolean>(n).fill(false);
  const distTo = new Array<number>(n).fill(Infinity);
  const parent = new Array<number>(n).fill(-1);
  distTo[0] = 0;
  for (let k = 0; k < n; k++) {
    let u = -1;
    let best = Infinity;
    for (let i = 0; i < n; i++) {
      if (!inTree[i] && distTo[i] < best) {
        best = distTo[i];
        u = i;
      }
    }
    if (u === -1) break;
    inTree[u] = true;
    for (let v = 0; v < n; v++) {
      if (inTree[v]) continue;
      const dx = points[u].x - points[v].x;
      const dy = points[u].y - points[v].y;
      const d2 = dx * dx + dy * dy;
      if (d2 < distTo[v]) {
        distTo[v] = d2;
        parent[v] = u;
      }
    }
  }
  const edges: Array<[number, number]> = [];
  for (let v = 1; v < n; v++) {
    if (parent[v] >= 0 && distTo[v] <= MAX_EDGE_LEN_SQ) {
      edges.push([parent[v], v]);
    }
  }
  return edges;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`failed to load ${src}`));
    img.src = src;
  });
}

function shuffle<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/* React hook: fetch and memoize a constellation for a single dex number. */
import { useEffect, useState } from "react";

export function useConstellation(dex: number, targetPoints = 28): CachedResult | null {
  const [result, setResult] = useState<CachedResult | null>(null);
  useEffect(() => {
    let live = true;
    getConstellation(dex, targetPoints)
      .then((r) => {
        if (live) setResult(r);
      })
      .catch(() => {
        if (live) setResult({ points: [], edges: [], aspect: 1 });
      });
    return () => {
      live = false;
    };
  }, [dex, targetPoints]);
  return result;
}
