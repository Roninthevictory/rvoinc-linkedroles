// RVO INC Secure Codespace Loader
// Dynamically loads full backend from the encrypted Codespaces Secret.

import fs from "fs";
import { execSync } from "child_process";

const secret = process.env.RVO_SECURE_CODE;
if (!secret) {
  console.error("❌ Missing RVO_SECURE_CODE secret!");
  process.exit(1);
}

// If the secret is base64, decode; otherwise use raw text
let code = secret;
try {
  // Heuristic: long A–Z0–9+/= string is likely base64
  if (/^[A-Za-z0-9+/=\r\n]+$/.test(secret.trim()) && secret.trim().length > 100) {
    code = Buffer.from(secret, "base64").toString("utf8");
  }
} catch {
  console.warn("⚠️ Secret not valid base64; using raw text.");
}

// Write to a temp file and execute
const tmp = "/tmp/rvo_backend.js";
fs.writeFileSync(tmp, code, { encoding: "utf8" });
console.log("🚀 Loaded secure backend into", tmp);
execSync(`node ${tmp}`, { stdio: "inherit" });

