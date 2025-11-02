import express from "express";

const router = express.Router();

router.post("/getReviewer", (req, res) => {
  const { ownerBU, reviewersMap } = req.body;

  if (!ownerBU || !reviewersMap)
    return res.status(400).json({ message: "ownerBU and reviewersMap are required" });

  // Filter out the ownerBU from reviewersMap
const eligibleReviewers = Object.entries(reviewersMap)
  .filter(([bu]) => bu !== ownerBU)
  .map(([_, email]) => email);

// Pick a random one, fallback to first email if none eligible
const reviewerEmail =
  eligibleReviewers.length > 0
    ? eligibleReviewers[Math.floor(Math.random() * eligibleReviewers.length)]
    : Object.values(reviewersMap)[0];

  res.json({ reviewerEmail });
});

export default router