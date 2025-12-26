# 🚀 Interview Preparation Platform

A **full-stack interview preparation platform** that allows users to practice technical questions, track performance analytics, bookmark important questions, and identify weak areas — built with **real-world backend architecture and modern frontend UI**.

This project is designed as a **portfolio-grade system**, not a demo app.

---

## 📌 Features

### 👤 Authentication & Authorization

* User registration & login (JWT based)
* Protected routes using middleware
* Role-based access (Admin / User)

### 🧠 Practice Sessions

* Start timed practice sessions
* Randomized question selection
* Topic & difficulty filtering
* Submit answers for evaluation

### 🔑 Smart Evaluation

* **Keyword-based answer evaluation**
* Partial correctness support
* Topic-wise accuracy calculation

### 📊 Dashboard & Analytics

* Total sessions & questions attempted
* Overall accuracy percentage
* Topic-wise performance breakdown
* Weak topic detection
* Strongest topic highlight
* Progress bars & visual indicators

### ⭐ Bookmarks

* Bookmark important questions
* Review bookmarked questions anytime
* Prevent duplicate bookmarks

### 🛠 Admin Features

* Create & manage interview questions
* Define keywords for evaluation
* Set difficulty & topic

---

## 🧱 Tech Stack

### Backend

* **Node.js**
* **Express.js**
* **MongoDB** (Mongoose)
* **JWT Authentication**
* RESTful API design

### Frontend

* **React.js**
* **React Router**
* **Tailwind CSS**
* Axios for API communication

---

## 📂 Project Structure

### Backend

```
backend/
 └─ src/
    ├─ controllers/
    ├─ routes/
    ├─ models/
    ├─ middleware/
    ├─ app.js
    └─ server.js
```

### Frontend

```
frontend/
 └─ src/
    ├─ pages/
    ├─ components/
    ├─ context/
    ├─ api/
    └─ App.jsx
```

---

## 🔐 API Endpoints

### Auth

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
```

### Questions

```
POST   /api/questions        (Admin only)
GET    /api/questions
```

### Practice Sessions

```
POST   /api/sessions/start
POST   /api/sessions/:id/submit
```

### Reports & Analytics

```
GET    /api/reports/progress
GET    /api/reports/session/:id
```

### Bookmarks

```
POST   /api/bookmarks
GET    /api/bookmarks
```

---

## 🧠 Evaluation Logic (Important)

Answers are evaluated using **keyword matching**:

* Each question contains predefined keywords
* If **≥ 50% keywords match**, answer is marked correct
* Topic-wise stats are calculated automatically

This simulates **subjective interview answers**, not MCQs.

---

## 📊 Dashboard Analytics Explained

* **Accuracy** = (Correct Answers / Total Answers) × 100
* **Weak Topics** = Accuracy < 60%
* **Strong Topics** = Highest accuracy among topics
* **Progress Bars** reflect topic performance visually

---

## ⚙️ Environment Variables

Create a `.env` file in backend root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## ▶️ Run Locally

### Backend

```bash
cd backend
npm install
node src/server.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Database Models

* **User**
* **Question**
* **Session**
* **Bookmark**

MongoDB references are used with proper population for analytics.

---

## 🏆 Why This Project Matters

This project demonstrates:

* Clean backend architecture
* Real-world REST API design
* Data analytics & aggregation
* Secure authentication flows
* Thoughtful UX & product thinking
* Scalable code organization

It closely resembles **real interview prep platforms** like LeetCode or InterviewBit.

---

## 🚀 Future Enhancements

* 📈 Charts using Recharts
* ⏱ Timed practice mode
* 📜 Session history page
* 🧠 Answer keyword feedback UI
* 🏆 Skill-level badges
* 🌐 Deployment (Render + Vercel)

---

## 👨‍💻 Author

**Ayan Badar**
BTech Computer Science
Backend & Full-Stack Developer

---


