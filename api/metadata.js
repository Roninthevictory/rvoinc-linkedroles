export default async function handler(req, res) {
  return res.status(200).json({
    metadata: [
      {
        key: "verified",
        name: "RVO Verified",
        description: "Confirmed through the RVO INC Gateway",
        type: 5
      }
    ]
  });
}

