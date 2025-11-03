// ✅ Fully ESM-compatible loader for Vercel
import fs from "fs";
import { execSync } from "child_process";

console.log("🔧 Starting RVO INC secure backend loader (ESM mode)...");

export default async function handler(req, res) {
  try {
    const code = process.env.RVO_SECURE_CODE;
    if (!code) {
      console.error("❌ Missing RVO_SECURE_CODE environment variable!");
      return res.status(500).send("Missing RVO_SECURE_CODE");
    }

    console.log("🧩 Environment variable found. Decoding...");
    let decoded = code;

    // Detect base64 and decode if needed
    if (/^[A-Za-z0-9+/=]+$/.test(code.trim()) && code.length > 100) {
      decoded = Buffer.from(code, "base64").toString("utf8");
      console.log("✅ Base64 decoded.");
    }

    // Write backend code to temporary file
    const path = "/tmp/rvo_backend.js";
    fs.writeFileSync(path, decoded);
    console.log(`📄 Backend written to ${path}`);

    // Execute backend file
    console.log("🚀 Executing backend...");
    execSync(`node ${path}`, { stdio: "inherit" });
    console.log("✅ Execution complete.");

    return res.status(200).send("RVO INC secure backend executed successfully.");
  } catch (err) {
    console.error("💥 Error executing backend:", err);
    return res.status(500).send("Server crashed: " + err.message);
  }
}
