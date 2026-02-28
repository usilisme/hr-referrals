const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "must", "can", "our", "your", "their",
  "we", "you", "they", "it", "this", "that", "as", "if", "when", "than",
  "so", "not", "also", "about", "up", "out", "into", "through", "during",
  "including", "across", "per", "between", "experience", "strong", "team",
  "work", "build", "using", "use", "you", "will", "join", "ability",
]);

/**
 * Tokenize a string: lowercase, split on non-alphanumeric, filter stop words
 * and tokens shorter than 2 characters.
 */
function tokenize(text) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .filter((t) => t.length >= 2 && !STOP_WORDS.has(t));
}

/**
 * Jaccard similarity between two sets.
 */
function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 0;
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

/**
 * Check if any profile token contains or equals a skill token (case-insensitive).
 * Handles partial matches like "js" in "javascript".
 */
function skillMatchScore(jobSkills, profileTokens) {
  if (!jobSkills || jobSkills.length === 0) return 0;

  let matched = 0;
  const matchedSkills = [];

  for (const skill of jobSkills) {
    const skillTokens = tokenize(skill);
    // A skill matches if ALL of its tokens appear in profile tokens (substring match)
    const allTokensMatch = skillTokens.every((st) =>
      profileTokens.some((pt) => pt.includes(st) || st.includes(pt))
    );
    if (allTokensMatch) {
      matched++;
      matchedSkills.push(skill);
    }
  }

  return { score: matched / jobSkills.length, matchedSkills };
}

/**
 * Match a profile text against all jobs.
 * Returns top 10 sorted by score descending.
 *
 * Scoring (V1 — Keyword Overlap):
 *   skillScore   (weight 0.6): fraction of job skills found in profile
 *   descScore    (weight 0.4): Jaccard similarity of profile tokens vs job description tokens
 *   finalScore   = 0.6 * skillScore + 0.4 * descScore, clamped to [0, 1]
 */
export function matchJobs(profileText, jobs) {
  const profileTokens = tokenize(profileText);
  const profileTokenSet = new Set(profileTokens);

  const scored = jobs.map((job) => {
    const jobDescText = [job.title, job.description, ...(job.skills || [])].join(" ");
    const jobDescTokens = tokenize(jobDescText);
    const jobDescTokenSet = new Set(jobDescTokens);

    // Skill subscore
    const { score: rawSkillScore, matchedSkills } = skillMatchScore(job.skills, profileTokens);

    // Description subscore — Jaccard on profile vs job description tokens
    const descScore = jaccardSimilarity(profileTokenSet, jobDescTokenSet);

    const finalScore = Math.min(1, 0.6 * rawSkillScore + 0.4 * descScore);

    // Also surface matched keywords from description (tokens in common)
    const matchedKeywords = [
      ...new Set([
        ...matchedSkills,
        ...[...profileTokenSet].filter((t) => jobDescTokenSet.has(t) && t.length >= 3),
      ]),
    ].slice(0, 10);

    return {
      ...job,
      score: Math.round(finalScore * 100) / 100,
      matchedKeywords,
    };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}
