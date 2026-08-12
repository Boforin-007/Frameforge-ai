/**
 * Deterministic, role-based card taglines for HACKER HOUSE — GOA identity cards.
 *
 * The tagline is derived from the person's role/designation.
 * The same role always produces the same tagline.
 */

interface RoleRule {
  /** Lowercased keywords matched against the normalized role/designation. */
  keywords: string[];
  tagline: string;
}

const ROLE_RULES: RoleRule[] = [
  {
    keywords: ["software developer", "software development"],
    tagline: "CODE KAR, SHIP KAR, CHILL KAR.",
  },
  {
    keywords: ["software engineer"],
    tagline: "BUILD SOLID, DEBUG LATER.",
  },
  {
    keywords: ["full stack", "fullstack"],
    tagline: "FRONTEND MAST, BACKEND TIGHT.",
  },
  {
    keywords: ["frontend", "front end", "ui developer"],
    tagline: "PIXEL SAHI, VIBE SAHI.",
  },
  {
    keywords: ["backend", "back end"],
    tagline: "BACKEND SAMBHAL LENGE, BHAI.",
  },
  {
    keywords: ["mobile", "android", "ios", "app developer"],
    tagline: "APP BANA, PHONE PE CHALA.",
  },
  {
    keywords: ["game", "game developer"],
    tagline: "GAME BANA, LEVEL UP KAR.",
  },
  {
    keywords: ["devops"],
    tagline: "CODE SE CLOUD TAK, SAB SET.",
  },
  {
    keywords: ["cloud", "cloud engineer"],
    tagline: "CLOUD MEIN BHI APNA ADDA.",
  },
  {
    keywords: ["qa", "quality assurance", "test engineer", "testing"],
    tagline: "BUG MILEGA, CHHODEGA NAHI.",
  },
  {
    keywords: ["ai engineer", "artificial intelligence"],
    tagline: "MACHINE KO BHI SCENE SAMJHA DENGE.",
  },
  {
    keywords: ["machine learning", "ml engineer"],
    tagline: "TRAIN KAR, TEST KAR, DEPLOY KAR.",
  },
  {
    keywords: ["data scientist", "data science"],
    tagline: "DATA BOLTA HAI, BOSS.",
  },
  {
    keywords: ["data analyst", "data analysis"],
    tagline: "NUMBERS DEKHO, STORY SAMJHO.",
  },
  {
    keywords: ["data engineer", "data engineering"],
    tagline: "DATA KA PIPELINE, APNA LIFELINE.",
  },
  {
    keywords: ["genai", "generative ai", "gen ai"],
    tagline: "PROMPT SE PRODUCT TAK.",
  },
  {
    keywords: ["computer vision", "vision engineer", "opencv"],
    tagline: "CAMERA DEKHEGA, SYSTEM SAMJHEGA.",
  },
  {
    keywords: ["robotics", "robot", "robocon"],
    tagline: "BOT BANEGA, SCENE CHALEGA.",
  },
  {
    keywords: ["iot", "internet of things"],
    tagline: "HAR DEVICE KO ONLINE KARENGE.",
  },
  {
    keywords: ["embedded", "embedded systems"],
    tagline: "CODE BHI, CIRCUIT BHI.",
  },
  {
    keywords: ["cybersecurity", "cyber security", "security engineer"],
    tagline: "SYSTEM SECURE, HACKER CURIOUS.",
  },
  {
    keywords: ["ethical hacker", "ethical hacking"],
    tagline: "SYSTEM SAMJHO, PHIR TODHO.",
  },
  {
    keywords: ["security researcher", "infosec", "information security"],
    tagline: "BREAK IT BEFORE THEY DO.",
  },
  {
    keywords: ["blockchain", "web3", "web 3"],
    tagline: "DECENTRALIZE KAR, BUILD KAR.",
  },
  {
    keywords: ["ui ux", "ui/ux", "ux ui", "ux designer"],
    tagline: "DEKHNE MEIN MAST, USE KARNE MEIN BHI.",
  },
  {
    keywords: ["product designer"],
    tagline: "IDEA KO PRODUCT BANA DENGE.",
  },
  {
    keywords: ["graphic designer", "graphic design"],
    tagline: "DESIGN KAREGA, ATTENTION LEGA.",
  },
  {
    keywords: ["motion designer", "motion design"],
    tagline: "STATIC KO BHI NACHA DENGE.",
  },
  {
    keywords: ["ux researcher", "user experience researcher"],
    tagline: "USER KO SAMJHO, PRODUCT BANAO.",
  },
  {
    keywords: ["product manager", "product management"],
    tagline: "IDEA SE LAUNCH TAK, SORTED.",
  },
  {
    keywords: ["technical lead", "tech lead"],
    tagline: "ARCHITECTURE SOLID, TEAM SORTED.",
  },
  {
    keywords: ["project manager", "project management"],
    tagline: "DEADLINE? HO JAYEGA, BHAI.",
  },
  {
    keywords: ["business analyst", "business analysis"],
    tagline: "PROBLEM SAMJHO, SOLUTION NIKALO.",
  },
  {
    keywords: ["founder", "co-founder", "cofounder"],
    tagline: "IDEA HAI, AB SHIP KARNA HAI.",
  },
  {
    keywords: ["startup builder", "startup"],
    tagline: "SOCHA HAI? AB BANA KE DIKHA.",
  },
  {
    keywords: ["open source", "opensource"],
    tagline: "CODE KHOL, SCENE BADA KARO.",
  },
  {
    keywords: ["technical writer", "technical writing"],
    tagline: "COMPLEX KO SIMPLE KAR DENGE.",
  },
  {
    keywords: ["developer advocate", "devrel", "developer relations"],
    tagline: "BUILD KARO, DUNIYA KO DIKHAO.",
  },
  {
    keywords: ["student developer", "student"],
    tagline: "SEEKH RAHE HAIN, BANA BHI RAHE HAIN.",
  },
  {
    keywords: ["hacker", "builder", "hackathon participant", "hackathon"],
    tagline: "SYSTEM SAMJHO, PHIR BUILD KARO.",
  },
];

/** Fallback for roles that do not match a predefined category. */
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
];

function normalize(role: string): string {
  return role.trim().toLowerCase().replace(/[^a-z0-9 ]/g, " ");
}

/** Deterministic hash so fallback picks never change between renders. */
function hash(value: string): number {
  let h = 0;

  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) >>> 0;
  }

  return h;
}

export function roleTagline(role: string): string {
  const normalized = normalize(role);

  if (!normalized) {
    return FALLBACK_TAGLINES[0];
  }

  for (const rule of ROLE_RULES) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return rule.tagline;
    }
  }

  return FALLBACK_TAGLINES[
    hash(normalized) % FALLBACK_TAGLINES.length
  ];
}