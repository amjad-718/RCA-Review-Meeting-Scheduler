import express from "express";
import reviewersMap from "../utils/reviewersMap";

const router = express.Router();

router.post("/getReviewer", (req, res) => {
  const { ownerBU } = req.body;

  if (!ownerBU)
    return res.status(400).json({ message: "ownerBU is required" });

  // Filter eligible BUs (exclude same BU)
  const eligibleBUs = Object.keys(reviewersMap).filter(bu => bu !== ownerBU);

  // Pick a random eligible BU
  const chosenBU : any =
    eligibleBUs.length > 0
      ? eligibleBUs[Math.floor(Math.random() * eligibleBUs.length)]
      : Object.keys(reviewersMap)[0]; // fallback

  const reviewerEmail = reviewersMap[chosenBU];

  res.json({ reviewerEmail });
});

export default router;