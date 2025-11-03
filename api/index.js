export default async function handler(req, res) {
  return res.status(200).json({
    system: "RVO INC Verification Gateway",
    status: "Operational",
    version: "v1.0.0"
  });
}
