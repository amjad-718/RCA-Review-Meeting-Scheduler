import express from "express";
import { google } from "googleapis";

const router = express.Router();

router.post("/scheduleEvent", async (req, res) => {
  const {
    googleAccessToken,
    ownerEmail,
    authorEmail,
    reviewerEmail,
    chosenSlot,
    incidentId,
    rcaDocLink,
    rcaPriority,
  } = req.body;

  if (!googleAccessToken || !ownerEmail || !authorEmail || !reviewerEmail || !chosenSlot) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: googleAccessToken });
    const calendar = google.calendar({ version: "v3", auth });

    const rcaIncidentLink = `https://yourdomain.com/rca/${incidentId}`;

    const uniqueAttendees = Array.from(
      new Set([ownerEmail, authorEmail, reviewerEmail])
    ).map(email => ({ email }));

    const event = {
      summary: `RCA Review - ${incidentId}`,
      description: `
        Hello All,

        Please join the RCA Review Meeting for ${rcaPriority}: ${incidentId}
        Incident Link: ${rcaIncidentLink}
        RCA Document: ${rcaDocLink}

        RCA Owner: ${ownerEmail}
        RCA Reviewer: ${reviewerEmail}
        Time: ${new Date(chosenSlot.start).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} - ${new Date(chosenSlot.end).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}

        Please Note:
        1. RCA authors are included along with the RCA Owner.
        2. Impacted POD EM is also included.

        PS: Please nominate a PoC if you are unavailable.

        Regards,
        Shine S Nath
        Problem Management Team
        `.trim(),
      start: { dateTime: new Date(chosenSlot.start).toISOString(), timeZone: "Asia/Kolkata" },
      end: { dateTime: new Date(chosenSlot.end).toISOString(), timeZone: "Asia/Kolkata" },
      attendees: uniqueAttendees,
      sendUpdates: "all",
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 30 },
          { method: "popup", minutes: 10 },
        ],
      },
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
