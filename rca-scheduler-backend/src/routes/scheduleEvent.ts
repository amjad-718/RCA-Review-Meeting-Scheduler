import express from "express";
import { google } from "googleapis";

const router = express.Router();

router.post("/scheduleEvent", async (req, res) => {
  const { googleAccessToken, ownerEmail, authorEmail, reviewerEmail, chosenSlot, incidentId } = req.body;

  if (!googleAccessToken || !ownerEmail || !authorEmail || !reviewerEmail || !chosenSlot)
    return res.status(400).json({ message: "Missing required fields" });

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: googleAccessToken });
    const calendar = google.calendar({ version: "v3", auth });

    const event = {
      summary: `RCA Review - ${incidentId}`,
      description: "Auto-scheduled RCA review meeting.",
      start: { dateTime: chosenSlot.start, timeZone: "Asia/Kolkata" },
      end: { dateTime: chosenSlot.end, timeZone: "Asia/Kolkata" },
      attendees: [
        { email: ownerEmail },
        { email: authorEmail },
        { email: reviewerEmail },
      ],
      sendUpdates: "all",
    };

    const insertRes = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    res.json({ message: "Event created", eventId: insertRes.data.id });
  } catch (err: any) {
    res.status(500).json({ message: "Error scheduling event", error: err.message });
  }
});

export default router;
