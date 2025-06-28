export enum METHOD_TYPE {
  POST = "POST",
  GET = "GET",
}

//Fisher-Yates (aka Durstenfeld) shuffle:
export function shuffle<T>(array: T[]) {
  const arr = [...array]; // create a copy to avoid mutating original
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index
    [arr[i], arr[j]] = [arr[j], arr[i]]; // swap
  }
  return arr;
}

export function get(key: string) {
  return localStorage.getItem(key);
}

export function save(key: string, value: string) {
  return localStorage.setItem(key, value);
}

export function clear() {
  return localStorage.clear();
}

export function clearItem(key: string) {
  return localStorage.removeItem(key);
}

export function getHashRoundId(key: string | null) {
  return key ? key.substring(0, 4).toUpperCase() : "NEW";
}

// Helper: calculate minutes and seconds
export function getTimeRemaining(target: number) {
  const total = target - new Date().getTime();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);

  return { total, hours, minutes: minutes, seconds };
}

// Pad with leading zeros
export function pad(n: number) {
  return n.toString().padStart(2, "0");
}
