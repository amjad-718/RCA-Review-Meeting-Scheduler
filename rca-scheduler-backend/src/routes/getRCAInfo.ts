import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/getRCAInfo", async (req, res) => {
  const { devrevApiKey, incidentId } = req.body;
  if (!devrevApiKey || !incidentId)
    return res.status(400).json({ message: "devrevApiKey and incidentId are required" });

  try {
    const devrevResponse = await axios.get(
      "https://api.devrev.ai/incidents.get",
      {
        params: { id: incidentId }, // incidentId sent as query param
        headers: {
          Authorization: `Bearer ${devrevApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log(devrevResponse.data);
    const incident = devrevResponse.data?.incident;
    if (!incident) return res.status(404).json({ message: "Incident not found" });

    const ownerEmail = incident.owned_by[0].email;
    const ownerName = incident.owned_by[0].full_name;
    // const ownerBU = incident.custom_fields?.BU || incident.BU || incident.owner?.BU || null;

    // res.json({ ownerEmail, authorEmail, ownerBU });
    res.json({ ownerName , ownerEmail });
  } catch (err: any) {
    res.status(500).json({ message: "DevRev fetch failed", error: err.response?.data || err.message });
  }
});

export default router;
