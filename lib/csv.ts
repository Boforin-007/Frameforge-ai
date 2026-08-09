export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      row.push(cell);
      cell = "";
      if (row.some((c) => c.trim() !== "")) rows.push(row);
      row = [];
    } else {
      cell += ch;
    }
  }

  row.push(cell);
  if (row.some((c) => c.trim() !== "")) rows.push(row);
  return rows;
}

export function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

const FIELD_ALIASES: Record<string, string[]> = {
  name: ["name", "fullname", "full name", "employee", "employee name", "person", "student"],
  id: ["id", "employeeid", "employee id", "emp id", "cardno", "card no", "number", "uid"],
  designation: ["designation", "role", "title", "position", "course", "job", "jobtitle"],
  department: ["department", "dept", "unit", "branch", "team"],
  organization: ["organization", "org", "company", "institution", "college", "school"],
  email: ["email", "e-mail", "mail", "emailaddress"],
  phone: ["phone", "mobile", "contact", "telephone", "tel", "phonenumber"],
  photoUrl: ["photo", "photo url", "photo url", "image", "imageurl", "image url", "avatar", "picture", "pic"],
  logoUrl: ["logo", "logo url", "logo url", "logoimage", "logo image"],
};

export type CsvField =
  | "name"
  | "id"
  | "designation"
  | "department"
  | "organization"
  | "email"
  | "phone"
  | "photoUrl"
  | "logoUrl";

/** Suggests a header index (or undefined) for each known field, auto-matching by alias. */
export function suggestMapping(headers: string[]): Record<CsvField, number | undefined> {
  const normalized = headers.map(normalizeHeader);
  const mapping: Record<CsvField, number | undefined> = {
    name: undefined,
    id: undefined,
    designation: undefined,
    department: undefined,
    organization: undefined,
    email: undefined,
    phone: undefined,
    photoUrl: undefined,
    logoUrl: undefined,
  };

  for (const field of Object.keys(FIELD_ALIASES) as CsvField[]) {
    const index = normalized.findIndex((h) =>
      FIELD_ALIASES[field].some((alias) => h === normalizeHeader(alias))
    );
    if (index >= 0) mapping[field] = index;
  }
  return mapping;
}