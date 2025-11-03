import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: "Missing code parameter." });
    }

    // Hardcoded config
    const CLIENT_ID = "1434663387174015037";
    const CLIENT_SECRET = "Vg3XFZ5yiJNUPCxZvdO6GXT2SM2npoSZ"; // ⬅️ Replace with your real secret
    const REDIRECT_URI = "https://rvoinc-linkedroles.vercel.app/api/link";

    // Step 1: Exchange code for an access token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("❌ Token exchange failed:", tokenData);
      return res.status(500).json({ error: "Token exchange failed", tokenData });
    }

    // Step 2: Get user info
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const user = await userResponse.json();

    // Step 3: Update the Linked Role metadata
    const metadataResponse = await fetch(
      `https://discord.com/api/users/@me/applications/${CLIENT_ID}/role-connection`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform_name: "RVO INC Verification",
          platform_username: user.username,
          metadata: { verified: true },
        }),
      }
    );

    const metadataData = await metadataResponse.json();

    if (!metadataResponse.ok) {
      console.error("❌ Metadata update failed:", metadataData);
      return res.status(500).json({ error: "Metadata update failed", metadataData });
    }

    // Step 4: Success
    return res.status(200).send(`
      <html>
        <head>
          <title>RVO INC Verification</title>
          <style>
            body {
              background-color: #0d0d0d;
              color: #fff;
              font-family: 'Inter', sans-serif;
              text-align: center;
              padding-top: 100px;
            }
            h1 { color: #ff2020; }
            p { color: #ccc; }
          </style>
        </head>
        <body>
          <h1>✅ Verified Successfully</h1>
          <p>Welcome, ${user.username}! Your verification has been linked.</p>
          <p>You may now close this page.</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("💥 Serverless crash:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
