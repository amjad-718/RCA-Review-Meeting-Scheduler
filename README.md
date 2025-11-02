## 🧠 RCA Scheduler

**RCA Scheduler** is a full-stack tool that automates RCA meeting scheduling by integrating:

* 🧾 **DevRev API** – to fetch incident and RCA details
* 📅 **Google Calendar API** – to find reviewer availability and schedule events
* 💻 **Angular Frontend** – for Google sign-in and user interface
* ⚙️ **Node.js Backend (Express)** – for logic orchestration and slot finding

It helps automatically find the right reviewer, determine available meeting slots, and schedule the RCA meeting — all with one click.

---

## 🚀 Features

✅ Google OAuth login (secure calendar access)
✅ Fetch incident data from DevRev
✅ Smart reviewer selection with weekly rotation
✅ Automatically detects busy slots and avoids lunch hours
✅ Finds the next available 30-min slot (Mon–Fri, 10 AM–6 PM IST)
✅ Schedules RCA meetings directly in Google Calendar
✅ Angular + Express + TypeScript full-stack setup

---
## ⚙️ Setup Guide

### 🖥️ 1. Clone the repository

```bash
git clone https://github.com/<your-username>/rca-scheduler.git
cd rca-scheduler
```

---

### 🧩 2. Backend Setup

```bash
cd rca-scheduler-backend
npm install
```

Create a `.env` file:

```env
PORT=4000
DEVREV_API_BASE=https://api.devrev.ai
GOOGLE_PROJECT_ID=your-google-project-id
```

Run the server:

```bash
npm run dev
```

---

### 💻 3. Frontend Setup

```bash
cd rca-scheduler-frontend
npm install
```

Update your Google OAuth Client ID in:

```
src/environments/environment.ts
```

Run Angular app:

```bash
ng serve
```

Then visit:
👉 [http://localhost:4200](http://localhost:4200)

---

## 🔑 Google API Configuration

1. Go to **Google Cloud Console → APIs & Services → Credentials**
2. Create **OAuth 2.0 Client ID**

   * Type: Web application
   * Authorized JavaScript origins: `http://localhost:4200`
   * Authorized redirect URIs: `http://localhost:4200`
3. Enable these APIs:

   * Google Calendar API
   * Google Drive API
   * Google Sheets API
   * Google Docs API
4. Copy your Client ID into `environment.ts`
   
---

## 🧱 Tech Stack

| Layer               | Technology              |
| ------------------- | ----------------------- |
| Frontend            | Angular 17 + TypeScript |
| Backend             | Node.js + Express       |
| API Integration     | Google APIs, DevRev API |
| Auth                | Google OAuth 2.0        |
| Calendar Scheduling | Google Calendar API     |

---

## 🧑‍💻 Developer Notes

* Default meeting duration: **30 minutes**
* Default time range: **10:00 AM – 6:00 PM IST** (excluding 1–2 PM lunch)
* Avoids weekends automatically.

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b branchName`
3. Commit changes: `git commit -m "Add new feature"`
4. Push to branch: `git push origin branchName`
5. Open a Pull Request

---

## 🧾 License

This project is licensed under the **MIT License**.

