-- ==============================================================================
-- STUDYVERSE AI — COMPLETE DATABASE SCHEMA (28 TABLES)
-- Supabase PostgreSQL with RLS, Indexes, Foreign Keys & Triggers
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. EXAMS
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    icon VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SUBJECTS
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50),
    icon VARCHAR(100),
    color VARCHAR(50),
    total_chapters INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CHAPTERS
CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    order_index INT DEFAULT 1,
    weightage VARCHAR(50) DEFAULT 'Medium',
    estimated_hours NUMERIC(4, 1) DEFAULT 4.0,
    summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LEVELS DEFINITION
CREATE TABLE IF NOT EXISTS public.levels (
    level_number INT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    min_xp INT NOT NULL,
    badge_icon VARCHAR(100),
    reward_coins INT DEFAULT 50,
    description TEXT
);

-- 5. PROFILES (Linked to Supabase Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(150),
    avatar_url TEXT,
    target_exam_id UUID REFERENCES public.exams(id) ON DELETE SET NULL,
    target_exam_name VARCHAR(100) DEFAULT 'JEE Main',
    preparation_level VARCHAR(50) DEFAULT 'Intermediate', -- Beginner, Intermediate, Advanced
    daily_goal_minutes INT DEFAULT 180, -- 3 hours default
    target_exam_date DATE,
    current_level INT DEFAULT 1 REFERENCES public.levels(level_number),
    current_xp INT DEFAULT 0,
    coins INT DEFAULT 100,
    battle_rating INT DEFAULT 1000, -- Elo-style rating
    current_streak INT DEFAULT 1,
    longest_streak INT DEFAULT 1,
    last_active_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. USER EXAM PROGRESS (Chapter tracking)
CREATE TABLE IF NOT EXISTS public.user_exam_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'not_started', -- 'not_started', 'learning', 'practicing', 'completed'
    progress_percentage INT DEFAULT 0,
    revision_count INT DEFAULT 0,
    last_studied_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, chapter_id)
);

-- 7. TASKS (Daily Quests)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(150),
    chapter VARCHAR(200),
    description TEXT,
    difficulty VARCHAR(50) DEFAULT 'Medium', -- Easy, Medium, Hard, Epic
    estimated_duration_minutes INT DEFAULT 45,
    due_date DATE DEFAULT CURRENT_DATE,
    xp_reward INT DEFAULT 50,
    coins_reward INT DEFAULT 10,
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, rescheduled
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TASK COMPLETIONS (Prevents duplicate XP reward payouts)
CREATE TABLE IF NOT EXISTS public.task_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    xp_awarded INT NOT NULL,
    coins_awarded INT NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(task_id, user_id)
);

-- 9. FOCUS SESSIONS
CREATE TABLE IF NOT EXISTS public.focus_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration_minutes INT NOT NULL,
    subject VARCHAR(150),
    chapter VARCHAR(200),
    quest_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    interruptions_count INT DEFAULT 0,
    xp_awarded INT NOT NULL,
    coins_awarded INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'completed', -- completed, interrupted
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. XP TRANSACTIONS (Server Ledger)
CREATE TABLE IF NOT EXISTS public.xp_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    source VARCHAR(50) NOT NULL, -- quest, focus_timer, quiz, battleground, streak_reward
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. STREAKS
CREATE TABLE IF NOT EXISTS public.streaks (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_streak INT DEFAULT 1,
    longest_streak INT DEFAULT 1,
    last_activity_date DATE DEFAULT CURRENT_DATE,
    freeze_days_remaining INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. ACHIEVEMENTS DEFINITION
CREATE TABLE IF NOT EXISTS public.achievements (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- Quests, Streaks, Focus, Mastery, Combat
    badge_icon VARCHAR(100) NOT NULL,
    reward_xp INT DEFAULT 100,
    reward_coins INT DEFAULT 50,
    requirement_type VARCHAR(50),
    requirement_value INT
);

-- 13. USER ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id VARCHAR(100) REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    claimed BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, achievement_id)
);

-- 14. GROUPS (Guilds)
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    target_exam VARCHAR(100) NOT NULL,
    is_public BOOLEAN DEFAULT TRUE,
    invite_code VARCHAR(20) UNIQUE NOT NULL,
    banner_url TEXT,
    leader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    total_xp BIGINT DEFAULT 0,
    level INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. GROUP MEMBERS
CREATE TABLE IF NOT EXISTS public.group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member', -- leader, officer, member
    weekly_xp INT DEFAULT 0,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- 16. QUIZZES
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    subject VARCHAR(150),
    chapter VARCHAR(200),
    difficulty VARCHAR(50) DEFAULT 'Medium',
    question_count INT DEFAULT 10,
    time_limit_minutes INT DEFAULT 15,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. QUIZ QUESTIONS
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- array of strings: ["Option A", "Option B", ...]
    correct_option_index INT NOT NULL,
    explanation TEXT,
    difficulty VARCHAR(50) DEFAULT 'Medium',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. QUIZ ATTEMPTS
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE SET NULL,
    quiz_title VARCHAR(200),
    score INT NOT NULL,
    total_questions INT NOT NULL,
    accuracy_percentage NUMERIC(5, 2) NOT NULL,
    time_spent_seconds INT NOT NULL,
    xp_awarded INT NOT NULL,
    coins_awarded INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. BATTLES
CREATE TABLE IF NOT EXISTS public.battles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mode VARCHAR(50) NOT NULL, -- quick_10, standard_30, boss_50
    subject VARCHAR(100) DEFAULT 'Mixed',
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. BATTLE PARTICIPANTS
CREATE TABLE IF NOT EXISTS public.battle_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    battle_id UUID REFERENCES public.battles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    opponent_name VARCHAR(100) NOT NULL,
    opponent_rating INT NOT NULL,
    user_score INT NOT NULL,
    opponent_score INT NOT NULL,
    is_victory BOOLEAN NOT NULL,
    rating_delta INT NOT NULL,
    xp_awarded INT NOT NULL,
    coins_awarded INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. AI CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) DEFAULT 'Study Session',
    subject VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. AI MESSAGES
CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL, -- 'user' or 'ai'
    content TEXT NOT NULL,
    action_type VARCHAR(50), -- explain, solve, hint, summarize, notes, quiz, flashcards
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. UPLOADED FILES
CREATE TABLE IF NOT EXISTS public.uploaded_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. PRODUCTS (Physical Study Shop)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL, -- Books, Pens, Pencils, Notebooks, Geometry, Highlighters, Bags, Calculators
    description TEXT,
    price_cents INT NOT NULL,
    original_price_cents INT,
    rating NUMERIC(2, 1) DEFAULT 4.8,
    reviews_count INT DEFAULT 42,
    stock INT DEFAULT 100,
    image_url TEXT,
    badge VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    total_amount_cents INT NOT NULL,
    shipping_address JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed', -- confirmed, processing, shipped, delivered
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    quantity INT NOT NULL,
    price_cents INT NOT NULL
);

-- 27. REWARD ITEMS (Virtual Coin Shop)
CREATE TABLE IF NOT EXISTS public.reward_items (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Themes, Badges, Accessories, Backgrounds, Effects
    description TEXT,
    coin_price INT NOT NULL,
    icon VARCHAR(100),
    effect_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 28. USER INVENTORY / REWARD PURCHASES
CREATE TABLE IF NOT EXISTS public.user_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    reward_item_id VARCHAR(100) REFERENCES public.reward_items(id) ON DELETE CASCADE,
    is_equipped BOOLEAN DEFAULT FALSE,
    purchased_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, reward_item_id)
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_subjects_exam_id ON public.subjects(exam_id);
CREATE INDEX IF NOT EXISTS idx_chapters_subject_id ON public.chapters(subject_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_id ON public.focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user_id ON public.xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON public.ai_messages(conversation_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_exam_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;

-- Base RLS Policies: Users can only read/write their own records
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own tasks" ON public.tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own focus sessions" ON public.focus_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own xp transactions" ON public.xp_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own progress" ON public.user_exam_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own quiz attempts" ON public.quiz_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own AI conversations" ON public.ai_conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own AI messages" ON public.ai_messages FOR ALL USING (
    EXISTS (SELECT 1 FROM public.ai_conversations WHERE id = conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can view public exams" ON public.exams FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view public subjects" ON public.subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view public chapters" ON public.chapters FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view levels" ON public.levels FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view achievements" ON public.achievements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view products" ON public.products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view reward items" ON public.reward_items FOR SELECT TO authenticated USING (true);
