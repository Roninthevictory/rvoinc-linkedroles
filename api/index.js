// /api/index.js — ESM-safe version for Vercel

import fs from "fs";
import { execSync } from "child_process";

console.log("🔧 Starting RVO INC secure backend loader...");

export default async function handler(req, res) {
  try {
    const secureCode = process.env.RVO_SECURE_CODE;
    if (!secureCode) {
      console.error("❌ Missing RVO_SECURE_CODE environment variable!");
      res.status(500).send("Missing RVO_SECURE_CODE");
      return;
    }

    console.log("🧩 RVO_SECURE_CODE found. Decoding...");
    let code = secureCode;

    if (/^[A-Za-z0-9+/=]+$/.test(code.trim()) && code.length > 100) {
      code = Buffer.from(code, "base64").toString("utf8");
      console.log("✅ Base64 decoded.");
    } else {
      console.log("⚠️ Using raw text code.");
    }

    fs.writeFileSync("/tmp/rvo_backend.js", code);
    console.log("📄 Wrote backend file.");

    console.log("🚀 Executing backend...");
    execSync("node /tmp/rvo_backend.js", { stdio: "inherit" });

    console.log("✅ Backend executed successfully.");
    res.status(200).send("Backend executed successfully.");
  } catch (err) {
    console.error("💥 Error during backend execution:", err);
    res.status(500).send("Server crashed: " + err.message);
  }
}
