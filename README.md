# STUDYVERSE AI 🌌⚔️
### *Prepare. Compete. Level Up.*

StudyVerse AI is a next-generation gamified exam-preparation platform engineered for competitive aspirants (JEE Main, JEE Advanced, NEET, UPSC, GATE, SSC, CAT). It merges the addictive progression loop of an RPG with disciplined focus tools, interactive syllabus mapping, peer battlegrounds, and multimodal AI tutoring.

---

## 🎮 The Core Experience

```
SIGN UP → TARGET EXAM → SELECT CHAPTERS → DAILY GOAL → QUESTS
  ↓
FOCUS TIMER (2 XP/min) → EARN XP & COINS → LEVEL UP (1 to 10) → STREAK
  ↓
STUDY GUILDS → COMPETITIVE BATTLEGROUND → CHAPTER QUIZZES → AI TUTOR → REWARD SHOP
```

---

## 🚀 Key Features

1. **Futuristic RPG Cyber Theme & Design System**:
   - Deep navy / obsidian space palette with cyber purple, electric cyan, and solar amber highlights.
   - Glassmorphism cards, glowing XP bars, animated level badges, and sound effects synthesized via the native Web Audio API (zero external audio dependencies).
2. **10 Non-Linear RPG Levels**:
   - Level 1 (0 XP) → Level 2 (100 XP) → Level 3 (250 XP) → Level 4 (450 XP) → Level 5 (700 XP) → Level 6 (1000 XP) → Level 7 (1400 XP) → Level 8 (1900 XP) → Level 9 (2500 XP) → Level 10 (3200 XP - 👑 LEGENDARY SCHOLAR).
   - Animated Level Up modal with confetti cannons, coin grants (+50 Coins), and title unlocks.
3. **Full CRUD Daily Quests**:
   - Create, edit, delete, reschedule, and complete quests filtered by subject and status.
   - Difficulty tiers (Easy, Medium, Hard, Epic) with server-validated payouts preventing duplicate reward exploits.
4. **Deep Focus Chrono Timer (2 XP / Study Minute)**:
   - Presets (25m, 50m, 90m, or custom duration) linked to subjects and active quests.
   - **Tab Visibility & Interruption Tracking**: Detects window switching, increments interruption count, and triggers real-time distraction warnings.
   - Fullscreen mode and chime controls.
5. **Exam Syllabus Preparation Matrix**:
   - Exam → Subject → Chapter hierarchy.
   - Chapter statuses (`Not Started`, `Learning`, `Practicing`, `Completed`).
   - Dynamic subject mastery percentage bars.
6. **Quiz Engine & Completed-Chapter Challenge**:
   - Chapter quizzes with countdown timers, question palettes, and review marking.
   - **Quiz from Completed Chapters**: Automatically generates multi-chapter challenges from chapters marked 100% completed.
   - Detailed step-by-step solution explanations with formula breakdowns.
7. **Study Battleground Arena**:
   - Modes: Quick Battle (10 Qs), Standard Battle (30 Qs), Boss Battle (50 Qs vs Grand Proctor AI).
   - Real-time head-to-head split scoreboard against simulated AI challengers.
   - Distinct **Battle Rating (ELO)** ladder separated from XP.
8. **Study Guilds & Global Leaderboard**:
   - Browse, search, create, and join guilds via private invite codes.
   - Guild rosters displaying levels, weekly XP velocity, and active streaks.
   - Leaderboards with `WEEK`, `MONTH`, and `ALL TIME` tabs and a top-3 podium.
9. **Multimodal AI Tutor (`/ai-tutor`)**:
   - Quick actions: *Explain Concept*, *Solve Step-by-Step*, *Give Me a Hint*, *Summarize Chapter*, *Revision Notes*, *Flashcard Drill*, *Practice Qs*.
   - Input methods: Type prompt, Camera upload, Image attachment preview, PDF document indicator.
   - Server-side route calling Google Gemini 1.5 Flash or OpenAI with fallback instructional banners.
10. **Dual Marketplace**:
    - **Study Shop**: Physical essentials (textbooks, precision pens, notebooks, geometry boxes, scientific calculators) with cart, quantity management, mock checkout, and order history.
    - **Reward Shop**: Virtual cosmetic bazaar using earned Coins (Cyber Void Theme, Dragon Syllabus Crest, Holographic Pulse Ring, XP Potions).
11. **Streaks & Monthly Planner**:
    - 30-day habit matrix, streak shields, and claimable milestone bounties (7d badge, 14d coins, 30d theme).
    - Interactive monthly calendar with day agenda inspector to schedule study blocks and exam dates.
12. **Analytics & Character Sheet**:
    - Total study hours, tasks completed, quiz accuracy %, weekly focus distribution chart, and subject diagnostic strength bars.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide React, Canvas Confetti.
- **Backend**: Next.js Server Route Handlers (`/api/*`).
- **Database & Auth**: Supabase PostgreSQL with 28 relational tables, Row-Level Security (RLS) policies, and foreign key indexes.
- **Resilience**: Hybrid persistence supporting live Supabase or seamless local storage fallback with rich pre-seeded fixtures.
- **Audio**: Web Audio API synthesizer for zero-latency audio fanfares without external audio file overhead.

---

## 📂 Database Setup (Supabase)

The complete SQL scripts are located in the `supabase/` folder:
1. `supabase/schema.sql`: Full DDL script creating all 28 required tables:
   - `profiles`, `exams`, `subjects`, `chapters`, `user_exam_progress`
   - `tasks`, `task_completions`, `focus_sessions`, `xp_transactions`, `levels`, `streaks`
   - `achievements`, `user_achievements`, `groups`, `group_members`, `quizzes`
   - `quiz_questions`, `quiz_attempts`, `battles`, `battle_participants`
   - `ai_conversations`, `ai_messages`, `uploaded_files`
   - `products`, `orders`, `order_items`, `reward_items`, `user_inventory`
2. `supabase/seed.sql`: Pre-populates 10 levels, achievements, reward shop cosmetics, study shop catalog, and sample exam questions.

To apply to your Supabase project:
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open **SQL Editor**.
3. Paste and run `supabase/schema.sql`, followed by `supabase/seed.sql`.

---

## 🔑 Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your project keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Optional: Add your Google Gemini API key to enable live AI responses
GEMINI_API_KEY=your-gemini-api-key

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

*Note: If Supabase or AI keys are not provided, StudyVerse AI automatically runs in local development mode with instant test login and contextual AI tutoring assistance.*

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
http://localhost:3000
```

---

## 🧪 Testing the Complete Loop

1. **Authentication**: Navigate to `/login` or click **Instant One-Click Demo Login**, or register at `/signup`.
2. **Onboarding**: Complete the 6-step setup selecting Target Exam (e.g. JEE Main), Level, Subjects, Chapters, Daily Goal (3h), and Exam Date.
3. **Dashboard**: Observe character stats (Knowledge, Prep, Focus, Consistency), Level 6 badge, XP bar, today's goal ring, and countdown clock.
4. **Daily Quests**: Visit `/quests`, click **Forge New Quest**, then complete a quest to earn **+50 XP** and **+10 Coins** with celebratory sound!
5. **Focus Timer**: Visit `/timer`, choose a 25m or custom sprint, switch browser tabs to test the `⚠️ FOCUS INTERRUPTED` detection, then finish the session to earn **2 XP/min**.
6. **Preparation & Quizzes**: Visit `/preparation`, mark a chapter as `Completed`, then navigate to `/quiz` and click **From Completed Chapters** to generate a multi-chapter quiz!
7. **Battleground**: Visit `/battleground`, choose **Quick Battle (10 Qs)**, outscore the AI challenger, and claim your Battle Rating increase.
8. **Study & Reward Shops**: Visit `/shop` to add textbooks/calculators to your cart and complete a test checkout. Visit `/reward-shop` to spend Coins on cybernetic UI themes and crests.
