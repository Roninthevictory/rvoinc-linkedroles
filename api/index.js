// /api/index.js
import fs from "fs";
import { execSync } from "child_process";

console.log("🔧 Starting RVO INC secure backend loader...");

try {
  if (!process.env.RVO_SECURE_CODE) {
    console.error("❌ Missing RVO_SECURE_CODE environment variable!");
    return new Response("Missing RVO_SECURE_CODE", { status: 500 });
  }

  console.log("🧩 RVO_SECURE_CODE found. Decoding...");
  let code = process.env.RVO_SECURE_CODE;

  if (/^[A-Za-z0-9+/=]+$/.test(code.trim()) && code.length > 100) {
    code = Buffer.from(code, "base64").toString("utf8");
    console.log("✅ Base64 decoded.");
  } else {
    console.log("⚠️ Code not base64, using raw text.");
  }

  fs.writeFileSync("/tmp/rvo_backend.js", code);
  console.log("📄 Wrote /tmp/rvo_backend.js");

  console.log("🚀 Executing backend...");
  execSync("node /tmp/rvo_backend.js", { stdio: "inherit" });

  console.log("✅ Backend executed successfully.");
  return new Response("OK", { status: 200 });
} catch (err) {
  console.error("💥 Error during backend execution:", err);
  return new Response("Server crashed: " + err.message, { status: 500 });
}
