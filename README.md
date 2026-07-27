# 🌙 Seerah Quest Scholar

![Seerah Quest Scholar Platform](Screenshot%202026-07-27%20181639.png)

> An immersive, gamified, and AI-powered web application dedicated to the comprehensive study of the Prophetic Seerah (the life of Prophet Muhammad ﷺ).

Seerah Quest Scholar is a next-generation Islamic educational platform. It bridges classical scholarship with modern interactive learning paradigms to create a rich, engaging, and deeply personal study experience. Whether you are a casual learner or a dedicated student, this platform provides the tools to explore the life of the Prophet ﷺ like never before.

---
## Live App
**Link** : https://seraah-quest.vercel.app/

---

## 📸 Platform Showcase

### Core Views
<p align="center">
  <img src="Screenshot%202026-07-27%20181639.png" width="800" alt="App Dashboard" />
  <br /><em>The beautifully crafted Main Dashboard featuring progress tracking and daily insights.</em><br /><br />
  <img src="Screenshot%202026-07-27%20181658.png" width="800" alt="Timeline View" />
  <br /><em>Interactive Chronological Timeline detailing pivotal historical events.</em><br /><br />
  <img src="Screenshot%202026-07-27%20181712.png" width="800" alt="Reader View" />
  <br /><em>Distraction-free Reader View for classical texts with Arabic support.</em>
</p>

### New Features & Interactive Modules
<p align="center">
  <img src="Screenshot%202026-07-27%20202531.png" width="800" alt="Interactive Module 1" />
  <br /><em>Gamified Quizzes, Dynamic Leaderboards, and Progress Analytics.</em><br /><br />
  <img src="Screenshot%202026-07-27%20202612.png" width="800" alt="Interactive Module 2" />
  <br /><em>AI-Powered Seerah Assistant providing referenced and authentic answers.</em><br /><br />
  <img src="Screenshot%202026-07-27%20202625.png" width="800" alt="Interactive Module 3" />
  <br /><em>Daily Reflections, Personal Journaling, and Live Halaqah Integration.</em>
</p>

---

## ✨ Comprehensive Feature Breakdown

### 📚 1. Classical Library & Smart Reader
- **Curated Texts:** Browse classical biographies (e.g., *Ar-Raheeq Al-Makhtum*) and modern scholarly analyses.
- **Distraction-Free Environment:** Toggleable settings for font sizes, theme, bookmarking, and chapter progress tracking.
- **Text-to-Speech (TTS):** Listen to chapters aloud with seamless browser speech synthesis integration.
- **Native Arabic Support:** Beautifully formatted Arabic verses with authentic translations, transliterations, and references.

### ⏳ 2. Interactive Chronological Timeline
- **Historical Navigation:** Traverse pivotal events from 570 CE to 632 CE.
- **Rich Metadata:** View detailed historical records, geographical locations, and the key figures involved in each event.
- **Source Linking:** Direct links connecting historical events to their corresponding Quranic and Hadith references.

### 🎮 3. Gamified Study Engine
- **Adaptive Quizzing:** Test your knowledge across adaptive difficulty levels (Easy, Medium, Hard).
- **Motivation Systems:** Earn XP, maintain daily study streaks, and unlock exclusive *Scholar Badges*.
- **Visual Analytics:** Dynamic leaderboard tracking and detailed performance analytics rendered via **Recharts**.

### 🤖 4. AI-Powered Seerah Assistant
- **Contextual Intelligence:** Ask nuanced questions about historical events, classical references, and moral lessons.
- **Advanced LLMs:** Powered by modern AI models (e.g., Llama 3.3 70B via Groq) ensuring highly accurate, respectful, and fully referenced answers.
- **Journal Integration:** Seamlessly save AI-generated insights directly into your personal Reflection Journal for future study.

### 💭 5. Daily Reflections & Digital Journal
- **Guided Growth:** Receive daily guided reflection prompts paired with a carefully selected "Hadith of the Day".
- **Privacy-First:** A private, locally-persisted digital journal to track your spiritual growth and personal commitments.

### 🎥 6. Live Halaqah Integration
- **Virtual Study Circles:** Join scheduled live study circles natively within the application.
- **Jitsi Meet Integration:** Reliable video conferencing, screen sharing, and real-time collaboration without needing external apps.

---

## 🛠️ Technical Architecture

Built with a focus on speed, modularity, and offline capability.

- **Frontend Framework:** React 18 with TypeScript
- **Build Engine & Tooling:** Vite (lightning-fast HMR and optimized builds)
- **Styling & UI:** Tailwind CSS (featuring a custom *Glassmorphic Dark Mode* aesthetic)
- **Iconography:** Lucide React
- **Data Visualization:** Recharts
- **State Management:** React Hooks + LocalStorage (Zero-latency persistent offline data)
- **Backend/API Proxy:** Node.js/Express (Securely handles LLM API keys and provides streaming AI responses)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**

### Installation & Setup

1. **Clone and Install:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in the root directory and add your API keys to enable the AI Assistant:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   The application and the backend proxy will run at `http://localhost:3000`.

4. **Production Build:**
   ```bash
   npm run build
   npm run start
   ```

---

## 🔐 Privacy & Data Security

**Seerah Quest Scholar operates on a strict Privacy-First principle.**
- **Local Storage:** All user progress, journal entries, unlocked badges, and chat histories are stored **locally** in your browser (`localStorage`).
- **Zero Tracking:** No personal data or study habits are transmitted to external servers.
- *(Note: API requests to LLM providers for the AI Assistant feature only send your chat prompts, keeping your data footprint minimal and secure).*

---

## 🎨 UI/UX Design Philosophy

The interface is meticulously crafted using a **"Premium Glassmorphic Dark"** aesthetic. By utilizing deep emeralds, rich ambers, and slate tones, the UI evokes the tranquil and profound sense of classical Islamic scholarship while remaining visually striking, fully responsive, and highly accessible on modern displays.

<p align="center">
  <em>"Read! In the Name of your Lord, Who has created (all that exists)."</em> - (Surah Al-Alaq 96:1)
</p>
