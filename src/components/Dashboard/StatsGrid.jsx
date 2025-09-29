import React from 'react';
import { ArrowUpIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

/**
 * StatCard Component - Displays individual statistic cards
 * @param {Object} props - Component props
 * @param {Object} props.card - Card configuration
 * @param {Object} props.stats - Statistics data
 * @param {Function} props.onClick - Click handler
 */
export const StatCard = ({ card, stats, onClick }) => {
  const Icon = card.icon;
  const cardStats = stats[card.key];
  
  return (
    <div
      onClick={() => onClick(card.path)}
      className={`${card.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer group`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium mb-1">{card.title}</p>
          <div className="flex items-center space-x-2">
            {cardStats.loading ? (
              <div className="animate-pulse bg-white/30 h-8 w-16 rounded"></div>
            ) : (
              <p className="text-3xl font-bold">{cardStats.count.toLocaleString()}</p>
            )}
            <ArrowUpIcon className="w-4 h-4 text-white/60" />
          </div>
        </div>
        <div className="bg-white/20 p-3 rounded-lg group-hover:bg-white/30 transition-colors">
          <Icon className="w-8 h-8" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-white/80 text-sm">
        <span>View all</span>
        <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

/**
 * StatsGrid Component - Displays grid of statistic cards
 * @param {Object} props - Component props
 * @param {Array} props.cards - Array of card configurations
 * @param {Object} props.stats - Statistics data
 * @param {Function} props.onCardClick - Card click handler
 */
export const StatsGrid = ({ cards, stats, onCardClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => (
        <StatCard
          key={card.key}
          card={card}
          stats={stats}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
};