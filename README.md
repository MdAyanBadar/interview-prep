
# 🚀 AI-Powered Interview Preparation Platform

A **high-fidelity interview simulation system** that leverages **Google Gemini 1.5 Pro/Flash** to provide deep, subjective evaluation of technical answers. It combines instant MCQ grading with advanced AI feedback to help developers master technical interviews.

---

## 📌 Updated Key Features

### 🧠 Hybrid Practice Sessions

* **Mixed Mode:** Practice sessions now dynamically pull a 50/50 mix of Multiple Choice (MCQ) and Short Answer questions.
* **Topic & Difficulty Filtering:** Targeted practice for specific domains (React, Node.js, System Design).

### 🔑 Dual-Engine Evaluation

* **Local Engine:** Instant validation for MCQs with detailed explanations.
* **AI Engine (Gemini):** Short-answer questions are sent to Google Gemini for subjective analysis, scoring, and constructive feedback.
* **Intelligent JSON Parsing:** Backend logic to clean AI responses and handle rate limiting (429 errors) gracefully.

### 📊 Advanced Analytics & UX

* **Dynamic Page Loaders:** Context-aware loading screens ("Syncing Dashboard", "Fetching Bookmarks") to eliminate perceived latency.
* **AI Loading Overlay:** A specialized glassmorphism loader that keeps users engaged while Gemini processes complex answers.
* **Comprehensive Results:** Side-by-side comparison of user answers, correct answers, and AI-generated improvement tips.

---

## 🧱 Updated Tech Stack

### Backend

* **Node.js & Express.js**
* **MongoDB (Mongoose):** Using `$sample` aggregation for randomized, balanced question sets.
* **Google Generative AI SDK:** Integration with `gemini-1.5-flash`.
* **JWT & Middleware:** Secure session handling and admin-only question management.

### Frontend

* **React.js (Vite)**
* **Tailwind CSS:** Modern UI with Backdrop-blur and custom animations.
* **Lucide React:** Premium iconography for better visual hierarchy.
* **Axios:** Managed API requests with custom interceptors for loading states.

---

## 📂 New Architecture Highlights

### AI Evaluation Logic

The backend no longer just counts keywords. It sends the question context, expected keywords, and user response to the LLM:

```javascript
// Example Prompt Structure
{
  "role": "technical_interviewer",
  "task": "Evaluate the answer based on technical depth, keyword presence, and clarity."
}

```

---

## 📂 Updated Project Structure

### Backend

```
backend/
 └─ src/
    ├─ controllers/
    │  └─ sessionController.js (Logic for MCQ vs AI grading)
    ├─ models/
    │  └─ Question.js (Supports 'type': 'mcq' | 'short-answer')
    └─ utils/
       └─ aiHandler.js (Gemini API integration & retry logic)

```

### Frontend

```
frontend/
 └─ src/
    ├─ components/
    │  ├─ PageLoader.jsx (Context-aware switch loader)
    │  └─ AILoadingScreen.jsx (Gemini-specific grading screen)
    ├─ pages/
    │  └─ Results.jsx (Detailed feedback UI)

```

---

## ⚙️ Environment Variables

Your `.env` now requires the Gemini API Key:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_ai_key

```

---

## 📊 Evaluation Logic 2.0

| Question Type | Evaluation Method | Result Speed |
| --- | --- | --- |
| **MCQ** | Local Index Comparison | Instant |
| **Short Answer** | Gemini 1.5 Flash Analysis | 2 - 5 Seconds |

---

## 🏆 Why This Version Matters

This project demonstrates **AI Orchestration**:

1. It knows when *not* to use AI (saving costs/latency on MCQs).
2. It handles **asynchronous AI feedback** with a high-end UI/UX.
3. It uses **Prompt Engineering** to ensure the AI returns structured JSON that the frontend can parse reliably.

---

### 👨‍💻 Author

**MD Ayan Badar** *Full-Stack Engineer & AI Integration Specialist*

---

