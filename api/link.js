await fetch(
  `https://discord.com/api/users/@me/applications/1434663387174015037/role-connection`,
  {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      platform_name: "RVO INC Verification",
      platform_username: user.username,
      metadata: { verified: true }
    })
  }
);
