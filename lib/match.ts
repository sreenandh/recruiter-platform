export function basicMatchScore(required: string[], candidateSkills: string[]) {
  const r = new Set(required.map((s) => s.toLowerCase().trim()));
  const c = new Set(candidateSkills.map((s) => s.toLowerCase().trim()));
  if (r.size === 0) return 50;
  const hits = [...r].filter((s) => c.has(s)).length;
  return Math.round((hits / r.size) * 100);
}