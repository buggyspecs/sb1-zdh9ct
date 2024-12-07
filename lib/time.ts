export function formatTime(ms: number): string {
  const seconds = ms / 1000;
  return `${seconds.toFixed(2)}s`;
}