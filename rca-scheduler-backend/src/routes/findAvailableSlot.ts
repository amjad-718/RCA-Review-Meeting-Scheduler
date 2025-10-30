// import express from "express";
// import { generateCandidateSlots, isSlotFree } from "../utils/calendarUtils";

// const router = express.Router();

// router.post("/findAvailableSlot", (req, res) => {
//   const { busySlots } = req.body;
//   if (!busySlots) return res.status(400).json({ message: "busySlots required" });

//   const now = new Date();
//   const rangeEnd = new Date();
//   rangeEnd.setDate(now.getDate() + 7);
//   const duration = 30;

//   const candidateSlots = generateCandidateSlots(now, rangeEnd, duration);
//   const chosenSlot = candidateSlots.find(slot => isSlotFree(slot, busySlots));

//   if (!chosenSlot) return res.status(404).json({ message: "No free slot found" });
//   res.json({ chosenSlot });
// });

// export default router;
import express from "express";
import { generateCandidateSlots, isSlotFree } from "../utils/calendarUtils";

const router = express.Router();

// router.post("/findAvailableSlot", (req, res) => {
//   const { busySlots } = req.body;
//   if (!busySlots) return res.status(400).json({ message: "busySlots required" });

//   const now = new Date();
//   const rangeEnd = new Date();
//   rangeEnd.setDate(now.getDate() + 7);
//   const duration = 30;

//   const candidateSlots = generateCandidateSlots(now, rangeEnd, duration);
//   const chosenSlot = candidateSlots.find(slot => isSlotFree(slot, busySlots));

//   if (!chosenSlot) return res.status(404).json({ message: "No free slot found" });

//   // Convert to IST for readability
//   const istOptions: Intl.DateTimeFormatOptions = {
//     timeZone: "Asia/Kolkata",
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: false,
//   };

//   const formatter = new Intl.DateTimeFormat("en-IN", istOptions);
//   const chosenSlotIST = {
//     start: formatter.format(chosenSlot.start),
//     end: formatter.format(chosenSlot.end),
//   };

//   res.json({ chosenSlotIST });
// });
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
  const chosenSlot = candidateSlots.find(slot => isSlotFree(slot, busySlotsUTC));

  if (!chosenSlot) return res.status(404).json({ message: "No free slot found" });

  res.json({
  chosenSlot: {
    start: toIST(chosenSlot.start),
    end: toIST(chosenSlot.end),
  },
});
});

export default router;
