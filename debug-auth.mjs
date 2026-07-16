import { neon } from "@neondatabase/serverless";
import { existsSync, readFileSync } from "node:fs";

if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);

    if (!match || match[1].startsWith("#") || process.env[match[1]]) {
      continue;
    }

    process.env[match[1]] = (match[2] ?? "").replace(/^['"]|['"]$/g, "");
  }
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not defined.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const requiredTables = ["account", "notebooks", "notes", "session", "user", "verification"];

console.log("--- Checking DB tables ---");
const tables = await sql`
  SELECT table_name 
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  ORDER BY table_name
`;
const tableNames = tables.map((r) => r.table_name);
console.log("Tables in DB:", tableNames);
console.log(
  "Missing required tables:",
  requiredTables.filter((tableName) => !tableNames.includes(tableName)),
);

console.log("\n--- Checking 'account' table columns ---");
try {
  const cols = await sql`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'account'
    ORDER BY ordinal_position
  `;
  console.log("account columns:", cols.map((c) => `${c.column_name} (${c.data_type}, nullable=${c.is_nullable})`));
} catch (e) {
  console.error("Error checking account table:", e.message);
}

console.log("\n--- Checking 'user' table columns ---");
try {
  const cols = await sql`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'user'
    ORDER BY ordinal_position
  `;
  console.log("user columns:", cols.map((c) => `${c.column_name} (${c.data_type}, nullable=${c.is_nullable})`));
} catch (e) {
  console.error("Error checking user table:", e.message);
}
