import React from 'react';
import { Dog } from '../types/racing';
import { Trophy, Target, DollarSign, Heart } from 'lucide-react';

interface DogCardProps {
  dog: Dog;
  onBet?: (dog: Dog) => void;
  raceStatus?: 'upcoming' | 'live' | 'finished';
  position?: number;
}

const DogCard: React.FC<DogCardProps> = ({ dog, onBet, raceStatus, position }) => {
  const winRate = Math.round((dog.wins / dog.races) * 100);

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-xl p-6 border-4 border-yellow-300 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <div
              className="w-6 h-6 rounded-full mr-3 border-3 shadow-md animate-pulse"
              style={{
                backgroundColor: dog.coat.primary,
                borderColor: dog.coat.secondary
              }}
            ></div>
            <h3 className="text-xl font-bold text-gray-900">{dog.name}</h3>
            {position && (
              <span className="ml-2 px-3 py-1 bg-yellow-400 text-yellow-900 text-sm font-bold rounded-full animate-bounce">
                #{position} 🏆
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700 mb-1 font-medium">Handler: {dog.handler}</p>
          <p className="text-sm text-gray-700 mb-2 font-medium">Trainer: {dog.trainer}</p>
          <div className="flex items-center mb-2">
            <Heart className="w-4 h-4 text-pink-500 mr-2" />
            <span className="text-sm text-pink-600 font-bold">{dog.personality}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-orange-600 mb-1">{dog.odds}</div>
          <div className="text-xs text-gray-600 font-bold">SUCH ODDS</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-white rounded-xl border-2 border-yellow-200">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="w-5 h-5 text-yellow-600 mr-1" />
            <span className="text-lg font-bold text-gray-900">{dog.wins}</span>
          </div>
          <div className="text-xs text-gray-600 font-bold">MUCH WINS</div>
        </div>
        <div className="text-center p-3 bg-white rounded-xl border-2 border-blue-200">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-5 h-5 text-blue-600 mr-1" />
            <span className="text-lg font-bold text-gray-900">{winRate}%</span>
          </div>
          <div className="text-xs text-gray-600 font-bold">WOW RATE</div>
        </div>
        <div className="text-center p-3 bg-white rounded-xl border-2 border-green-200">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="w-5 h-5 text-green-600 mr-1" />
            <span className="text-lg font-bold text-gray-900">${(dog.earnings / 1000).toFixed(0)}k</span>
          </div>
          <div className="text-xs text-gray-600 font-bold">VERY EARN</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-700 mb-2 font-bold">Recent Form • Such History</div>
        <div className="flex space-x-2">
          {dog.form.map((pos, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                pos === '1'
                  ? 'bg-yellow-400 text-yellow-900 border-yellow-600 animate-bounce'
                  : pos === '2'
                  ? 'bg-gray-300 text-gray-800 border-gray-500'
                  : pos === '3'
                  ? 'bg-orange-300 text-orange-800 border-orange-500'
                  : 'bg-red-200 text-red-800 border-red-400'
              }`}
            >
              {pos}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl border-2 border-blue-200">
        <div className="text-xs text-gray-600 font-bold mb-1">DOGE STATS</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div><span className="font-bold">Age:</span> {dog.age} years</div>
          <div><span className="font-bold">Weight:</span> {dog.weight} lbs</div>
          <div><span className="font-bold">Races:</span> {dog.races} total</div>
          <div><span className="font-bold">Status:</span> Very Good Boy</div>
        </div>
      </div>

      {onBet && raceStatus === 'upcoming' && (
        <button
          onClick={() => onBet(dog)}
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-4 px-6 rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 font-bold text-lg shadow-lg transform hover:scale-105 border-2 border-orange-600"
        >
          🚀 BET ON DOGE 🚀
        </button>
      )}
    </div>
  );
};

export default DogCard;