-- ==============================================================================
-- STUDYVERSE AI — SEED DATA
-- 10 Levels, Exams, Subjects, Chapters, Questions, Products, Rewards, Achievements
-- ==============================================================================

-- 1. SEED LEVELS (10 LEVELS NON-LINEAR PROGRESSION)
INSERT INTO public.levels (level_number, title, min_xp, badge_icon, reward_coins, description)
VALUES 
(1, 'Novice Aspirant', 0, 'Seedling', 0, 'Beginning of the scholarly ascension'),
(2, 'Apprentice Scholar', 100, 'Scroll', 50, 'Grasping foundational concepts'),
(3, 'Focus Warrior', 250, 'Sword', 50, 'Mastering daily study discipline'),
(4, 'Concept Knight', 450, 'Shield', 75, 'Conquering challenging subjects'),
(5, 'Syllabus Slayer', 700, 'Zap', 100, 'Crushing chapters with speed and precision'),
(6, 'Chrono Master', 1000, 'Hourglass', 120, 'Unbreakable focus session commander'),
(7, 'Exam Tactician', 1400, 'Compass', 150, 'Strategic problem solver and test taker'),
(8, 'Grandmaster Sage', 1900, 'Flame', 200, 'Commanding top tier quiz percentiles'),
(9, 'Mythic Scholar', 2500, 'Sparkles', 250, 'Transcendent speed and analytical depth'),
(10, '👑 LEGENDARY SCHOLAR', 3200, 'Crown', 500, 'Supreme intellect and untamable study streak')
ON CONFLICT (level_number) DO UPDATE SET 
  title = EXCLUDED.title, 
  min_xp = EXCLUDED.min_xp,
  badge_icon = EXCLUDED.badge_icon;

-- 2. SEED ACHIEVEMENTS
INSERT INTO public.achievements (id, title, description, category, badge_icon, reward_xp, reward_coins, requirement_type, requirement_value)
VALUES
('first_quest', 'First Quest Cleared', 'Complete your very first daily study quest', 'Quests', 'CheckCircle2', 50, 20, 'quest_count', 1),
('streak_7', '7-Day Streak Fire', 'Maintain daily study streak for 7 consecutive days', 'Streaks', 'Flame', 150, 50, 'streak_days', 7),
('streak_30', '30-Day Unbreakable', 'Maintain daily study streak for 30 consecutive days', 'Streaks', 'Zap', 400, 150, 'streak_days', 30),
('focus_10h', '10 Hours of Deep Focus', 'Accumulate 10 total hours inside the focus timer', 'Focus', 'Clock', 200, 75, 'focus_minutes', 600),
('first_chapter', 'Chapter Master', 'Mark your first syllabus chapter as 100% Completed', 'Mastery', 'BookOpen', 100, 40, 'chapters_completed', 1),
('quiz_accuracy_90', 'Sniper Intellect', 'Score 90% or higher accuracy on any 10+ question quiz', 'Mastery', 'Target', 250, 100, 'quiz_accuracy', 90),
('first_battle_win', 'Gladiator Triumph', 'Win your first battle in the StudyVerse Battleground', 'Combat', 'Swords', 200, 80, 'battle_wins', 1),
('level_10_legend', 'Legendary Ascent', 'Ascend to Level 10 — Legendary Scholar status', 'Mastery', 'Crown', 1000, 500, 'level', 10)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED REWARD ITEMS (Virtual Coin Shop)
INSERT INTO public.reward_items (id, name, category, description, coin_price, icon, effect_data)
VALUES
('theme_cyber_purple', 'Cyber Void Theme', 'Themes', 'Futuristic neon purple aura and dark slate aesthetic', 300, 'Palette', '{"primary": "#8b5cf6", "glow": "purple"}'),
('theme_matrix_emerald', 'Matrix Protocol', 'Themes', 'Emerald green cybernetic telemetry aesthetic', 450, 'Terminal', '{"primary": "#10b981", "glow": "emerald"}'),
('theme_solar_gold', 'Solar Flare Gold', 'Themes', 'Blazing solar golden trim fit for top scholars', 600, 'Sun', '{"primary": "#f59e0b", "glow": "gold"}'),
('badge_dragon_slayer', 'Dragon Syllabus Badge', 'Badges', 'Special profile crest signifying exam domination', 500, 'ShieldAlert', '{"badge": "dragon"}'),
('badge_quantum_mind', 'Quantum Mind Crest', 'Badges', 'Holographic atomic crest for deep thinkers', 400, 'Atom', '{"badge": "quantum"}'),
('avatar_holo_border', 'Holographic Avatar Ring', 'Accessories', 'Glowing pulse ring circling your student profile avatar', 350, 'CircleDot', '{"border": "holo-pulse"}'),
('avatar_golden_crown', 'Golden Scholar Crown', 'Accessories', 'Royal golden laurels displayed atop your avatar', 800, 'Crown', '{"headwear": "crown"}'),
('booster_xp_potion', '1.5x XP Focus Potion', 'Effects', 'Grants 1.5x bonus XP on focus sessions for 2 hours', 200, 'FlaskConical', '{"multiplier": 1.5, "duration_minutes": 120}')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED PRODUCTS (Study Shop Catalog)
INSERT INTO public.products (id, name, category, description, price_cents, original_price_cents, rating, reviews_count, stock, image_url, badge)
VALUES
('b7d90e2f-5f93-4a6c-94ee-782161747801', 'HC Verma Concepts of Physics Vol 1 & 2', 'Books', 'The holy grail textbook for JEE Main & Advanced physics mastery.', 2999, 3600, 4.9, 1420, 50, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80', 'Best Seller'),
('b7d90e2f-5f93-4a6c-94ee-782161747802', 'Pilot G2 Premium Gel Pens (Pack of 5)', 'Pens', 'Ultra-smooth 0.5mm precision gel ink engineered for marathon note-taking sessions.', 799, 999, 4.8, 890, 120, 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&q=80', 'Essential'),
('b7d90e2f-5f93-4a6c-94ee-782161747803', 'Faber-Castell 9000 Graphite Pencils Set', 'Pencils', 'Precision sketching and diagram drawing pencils from 2B to 8B.', 599, 750, 4.7, 430, 80, 'https://images.unsplash.com/photo-1585336261026-78b191147a75?w=600&q=80', 'Popular'),
('b7d90e2f-5f93-4a6c-94ee-782161747804', 'StudyVerse Cyber Dot-Grid Hardbound Notebook (200 pgs)', 'Notebooks', '120 GSM bleed-resistant paper with numbered index and formula cheatsheet pocket.', 1199, 1499, 4.9, 560, 95, 'Student Favorite'),
('b7d90e2f-5f93-4a6c-94ee-782161747805', 'Stainless Steel Precision Geometry Math Box', 'Geometry', 'Heavy-duty technical compass, dividers, set-squares and shatterproof 30cm ruler.', 899, 1150, 4.6, 210, 60, 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&q=80', 'Durable'),
('b7d90e2f-5f93-4a6c-94ee-782161747806', 'Stabilo Boss Pastel Highlighters (Pack of 6)', 'Highlighters', 'Anti-dry out technology with soft pastel hues that won’t strain tired eyes.', 699, 850, 4.9, 1120, 150, 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=80', 'Trending'),
('b7d90e2f-5f93-4a6c-94ee-782161747807', 'Titan Ergonomic Student Backpack 32L (Waterproof)', 'Bags', 'Dedicated padded 16-inch laptop compartment, textbook sleeves, and lumbar support.', 3499, 4499, 4.8, 380, 40, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80', 'Heavy Duty'),
('b7d90e2f-5f93-4a6c-94ee-782161747808', 'Casio fx-991CW Advanced Scientific Calculator', 'Calculators', 'Approved for engineering entrances & university exams, dual power solar/battery.', 2499, 2899, 4.9, 2100, 75, 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?w=600&q=80', 'Top Rated')
ON CONFLICT (id) DO NOTHING;
