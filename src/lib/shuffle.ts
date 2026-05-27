/**
 * Seeded shuffle — deterministic randomization.
 * Same seed always produces same order (stable across refresh).
 * Used for randomizing question and option order per student/attempt.
 */

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Shuffle array with a seed string. Same seed = same result.
 */
export function seededShuffle<T>(array: T[], seed: string): T[] {
  const rng = seededRandom(hashString(seed));
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Shuffle options for a question. Returns mapping of display position to original key.
 * Example: { A: "C", B: "A", C: "D", D: "B" } means display position A shows original option C.
 */
export function shuffleOptions(
  options: string[],
  seed: string
): { shuffled: string[]; mapping: Record<string, string> } {
  const keys = options.map((_, i) => String.fromCharCode(65 + i)); // A, B, C, D, E
  const shuffledKeys = seededShuffle(keys, seed);
  const mapping: Record<string, string> = {};
  shuffledKeys.forEach((originalKey, displayIndex) => {
    mapping[String.fromCharCode(65 + displayIndex)] = originalKey;
  });
  return { shuffled: shuffledKeys.map((k) => options[k.charCodeAt(0) - 65]), mapping };
}
