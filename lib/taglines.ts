/**
 * Deterministic, role-based card taglines for HACKER HOUSE — GOA identity cards.
 *
 * The tagline is derived purely from the person's role/designation so the same
 * role always yields the same card text (no randomness on re-render).
 */

interface RoleRule {
  /** Lowercased keywords matched against the normalized role/designation. */
  keywords: string[]
  tagline: string
}

const ROLE_RULES: RoleRule[] = [
  { keywords: ["robotics", "robot", "robocon"], tagline: "BUILD. BREAK. BUILD BETTER." },
  { keywords: ["cyber", "security", "infosec"], tagline: "TRUST NOTHING. VERIFY EVERYTHING." },
  {
    keywords: ["machine learning", "ml", "ai", "artificial intelligence", "data sci", "llm"],
    tagline: "TEACH MACHINES TO THINK.",
  },
  { keywords: ["hardware", "embedded", "iot", "electronics", "mechatronic"], tagline: "MAKE IT REAL." },
  { keywords: ["product"], tagline: "BUILD WHAT MATTERS." },
  {
    keywords: ["design", "ui", "ux", "visual", "graphic", "creative", "illustrat"],
    tagline: "MAKE IDEAS TANGIBLE.",
  },
  { keywords: ["community", "events", "operations", "organizer"], tagline: "CONNECT THE BUILDERS." },
  {
    keywords: ["student", "intern", "trainee", "fresher", "junior"],
    tagline: "LEARN. BUILD. SHIP.",
  },
  {
    keywords: ["lead", "manager", "head", "director", "founder", "ceo", "cto"],
    tagline: "TURN IDEAS INTO SYSTEMS.",
  },
  { keywords: ["engineer", "engineering"], tagline: "ENGINEER THE IMPOSSIBLE." },
  {
    keywords: ["developer", "develop", "software", "programmer", "coder", "backend", "frontend", "full stack", "fullstack"],
    tagline: "SHIP WHAT YOU BUILD.",
  },
]

/** Fallback pool used when the role matches no predefined category. */
const FALLBACK_TAGLINES = [
  "SHIP THE UNBUILT.",
  "BUILD IN THE OPEN.",
  "CODE. COMMIT. REPEAT.",
  "MAKE IT WORK. THEN FAST.",
  "PROTOTYPE. TEST. ITERATE.",
  "ZERO TO SHIPPED.",
  "BUILD FOR THE LONG RUN.",
  "DEBUG THE FUTURE.",
  "AUTOMATE EVERYTHING.",
  "BREAK. FIX. IMPROVE.",
]

function normalize(role: string): string {
  return role.trim().toLowerCase().replace(/[^a-z0-9 ]/g, " ");
}

/** Deterministic hash of the role so the fallback pick never changes. */
function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function roleTagline(role: string): string {
  const normalized = normalize(role);
  if (!normalized) return FALLBACK_TAGLINES[0];

  for (const rule of ROLE_RULES) {
    if (rule.keywords.some((k) => normalized.includes(k))) {
      return rule.tagline;
    }
  }

  return FALLBACK_TAGLINES[hash(normalized) % FALLBACK_TAGLINES.length];
}