import express from "express";
import { generateCandidateSlots, isSlotFree } from "../utils/calendarUtils";

const router = express.Router();

function toIST(date: Date) {
  // Convert UTC to IST
  const istOffset = 5.5 * 60; // in minutes
  const local = new Date(date.getTime() + istOffset * 60 * 1000);
  return local.toISOString().replace("Z", "+05:30");
}

router.post("/findAvailableSlot", (req, res) => {
  const { busySlots } = req.body;
  if (!busySlots) return res.status(400).json({ message: "busySlots required" });

  // 🔹 Convert incoming slots to UTC
  interface BusySlot {
    start: string;
    end: string;
  }

  const busySlotsUTC = busySlots.map((slot: BusySlot) => ({
    start: new Date(slot.start),
    end: new Date(slot.end),
  }));

  const now = new Date();
  const rangeEnd = new Date();
  rangeEnd.setDate(now.getDate() + 7);
  const duration = 30;

  const candidateSlots = generateCandidateSlots(now, rangeEnd, duration);

  // Collect all free slots
  const freeSlots = candidateSlots.filter(slot => isSlotFree(slot, busySlotsUTC));

  // If none found, handle gracefully
  if (freeSlots.length === 0) {
    return res.status(404).json({ message: "No free slot found" });
  }

  // Pick one randomly
  const chosenSlot : any = freeSlots[Math.floor(Math.random() * freeSlots.length)];
  // const chosenSlot = candidateSlots.find(slot => isSlotFree(slot, busySlotsUTC));

  // if (!chosenSlot) return res.status(404).json({ message: "No free slot found" });

  res.json({
  chosenSlot: {
    start: toIST(chosenSlot.start),
    end: toIST(chosenSlot.end),
  },
});
});

export default router;
