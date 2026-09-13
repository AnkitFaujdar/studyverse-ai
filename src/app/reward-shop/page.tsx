'use client';

import React, { useState } from 'react';
import { 
  Gem, 
  Coins, 
  Sparkles, 
  Palette, 
  ShieldAlert, 
  Crown, 
  CircleDot, 
  FlaskConical, 
  Check, 
  Layers 
} from 'lucide-react';
import { useStudyVerse } from '@/lib/store/studyverse-context';
import { RewardItem } from '@/lib/types';

export default function RewardShopPage() {
  const { 
    profile, 
    rewardItems, 
    purchasedRewardIds, 
    purchaseReward, 
    equipReward 
  } = useStudyVerse();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const categories = ['All', 'Themes', 'Badges', 'Accessories', 'Effects'];

  const filteredItems = rewardItems.filter(
    (item) => categoryFilter === 'All' || item.category === categoryFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-wider mb-1">
            <Gem className="w-4 h-4" />
            <span>VIRTUAL BOUNTY BAZAAR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Reward Shop</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Exchange coins earned from completed study quests and focus sessions for exclusive themes and badges.
          </p>
        </div>

        {/* Live Coin Balance Pill */}
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-yellow-950/80 to-amber-950/60 border border-yellow-600/50 text-yellow-300 shadow-lg">
          <Coins className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          <div>
            <span className="text-[10px] text-yellow-400/80 block uppercase tracking-wider font-bold">
              Available Wealth
            </span>
            <span className="text-lg font-black text-white">{profile.coins} Coins</span>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
              categoryFilter === cat
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-400 text-white shadow-md shadow-purple-900/30'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const isOwned = purchasedRewardIds.includes(item.id);
          const isEquipped =
            profile.equippedTheme === item.id ||
            profile.equippedBadge === item.id ||
            profile.equippedFrame === item.id;

          return (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-[#0e1230]/90 border border-indigo-900/40 hover:border-purple-500/50 flex flex-col justify-between space-y-4 shadow-xl transition"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-2xl bg-purple-950/80 border border-purple-800/40 text-purple-400">
                    {item.category === 'Themes' && <Palette className="w-6 h-6" />}
                    {item.category === 'Badges' && <ShieldAlert className="w-6 h-6" />}
                    {item.category === 'Accessories' && <Crown className="w-6 h-6" />}
                    {item.category === 'Effects' && <FlaskConical className="w-6 h-6" />}
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-3">{item.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-yellow-400 font-black text-sm">
                  <Coins className="w-4 h-4 fill-yellow-400" />
                  <span>{item.coinPrice}</span>
                </div>

                {isEquipped ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-xs font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Equipped
                  </span>
                ) : isOwned ? (
                  <button
                    onClick={() => equipReward(item.id, item.category)}
                    className="px-4 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-xs font-bold text-cyan-300 transition"
                  >
                    Equip
                  </button>
                ) : (
                  <button
                    onClick={() => purchaseReward(item)}
                    disabled={profile.coins < item.coinPrice}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-xs font-bold text-white transition shadow-md shadow-purple-900/30"
                  >
                    Unlock
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
