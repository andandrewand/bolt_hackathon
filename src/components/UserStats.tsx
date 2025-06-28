import React from 'react';
import { UserStats as UserStatsType } from '../types/racing';
import { TrendingUp, DollarSign, Target, Trophy } from 'lucide-react';

interface UserStatsProps {
  stats: UserStatsType;
}

const UserStats: React.FC<UserStatsProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Your Performance</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="w-5 h-5 text-green-600 mr-1" />
            <span className="text-lg font-bold text-gray-900">
              ${stats.currentBalance.toLocaleString()}
            </span>
          </div>
          <div className="text-xs text-gray-500">Current Balance</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-5 h-5 text-blue-600 mr-1" />
            <span className="text-lg font-bold text-gray-900">{stats.winRate}%</span>
          </div>
          <div className="text-xs text-gray-500">Win Rate</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="w-5 h-5 text-yellow-600 mr-1" />
            <span className="text-lg font-bold text-gray-900">{stats.totalBets}</span>
          </div>
          <div className="text-xs text-gray-500">Total Bets</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-600 mr-1" />
            <span className={`text-lg font-bold ${stats.totalWon >= stats.totalWagered ? 'text-green-600' : 'text-red-600'}`}>
              ${(stats.totalWon - stats.totalWagered).toLocaleString()}
            </span>
          </div>
          <div className="text-xs text-gray-500">Profit/Loss</div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;