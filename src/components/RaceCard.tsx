import React from 'react';
import { Race } from '../types/racing';
import { Clock, MapPin, DollarSign, Trophy, Play, CheckCircle } from 'lucide-react';

interface RaceCardProps {
  race: Race;
  onSelectRace: (race: Race) => void;
}

const RaceCard: React.FC<RaceCardProps> = ({ race, onSelectRace }) => {
  const getStatusIcon = () => {
    switch (race.status) {
      case 'upcoming':
        return <Clock className="w-6 h-6 text-amber-600" />;
      case 'live':
        return <Play className="w-6 h-6 text-red-600 animate-pulse" />;
      case 'finished':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
    }
  };

  const getStatusColor = () => {
    switch (race.status) {
      case 'upcoming':
        return 'border-l-amber-500 bg-gradient-to-br from-amber-50 to-yellow-50';
      case 'live':
        return 'border-l-red-500 bg-gradient-to-br from-red-50 to-orange-50 animate-pulse';
      case 'finished':
        return 'border-l-green-500 bg-gradient-to-br from-green-50 to-emerald-50';
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-xl border-l-8 ${getStatusColor()} p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-4 border-yellow-200`}
      onClick={() => onSelectRace(race)}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{race.name}</h3>
          <div className="flex items-center text-gray-700 mb-2">
            <MapPin className="w-5 h-5 mr-3 text-orange-500" />
            <span className="text-lg font-medium">{race.track}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Clock className="w-5 h-5 mr-3 text-blue-500" />
            <span className="text-lg font-medium">{race.date} at {race.time}</span>
          </div>
        </div>
        <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-lg border-2 border-yellow-300">
          {getStatusIcon()}
          <span className="ml-3 text-lg font-bold capitalize text-gray-800">
            {race.status === 'live' ? 'LIVE WOW' : race.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center bg-blue-100 rounded-full px-4 py-2 border-2 border-blue-300">
          <Trophy className="w-5 h-5 text-blue-600 mr-2" />
          <span className="text-lg text-blue-800 font-bold">Distance: {race.distance}</span>
        </div>
        <div className="flex items-center bg-green-100 rounded-full px-4 py-2 border-2 border-green-300">
          <DollarSign className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-lg font-bold text-green-800">
            ${race.purse.toLocaleString()} DOGE
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-lg text-gray-700 font-bold">
          {race.dogs.length} Good Boys Racing 🐕
        </span>
        {race.status === 'live' && race.progress && (
          <div className="flex items-center space-x-3">
            <div className="w-32 bg-gray-200 rounded-full h-3 border-2 border-red-300">
              <div
                className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-300 animate-pulse"
                style={{ width: `${race.progress}%` }}
              ></div>
            </div>
            <span className="text-sm text-red-600 font-bold animate-pulse">🔥 LIVE WOW 🔥</span>
          </div>
        )}
      </div>

      {/* Mini dog animation for live races */}
      {race.status === 'live' && (
        <div className="mt-4 flex items-center space-x-2 bg-yellow-100 rounded-full px-4 py-2 border-2 border-yellow-300">
          {race.dogs.slice(0, 3).map((dog, index) => (
            <div
              key={dog.id}
              className="w-4 h-4 rounded-full animate-bounce border-2 border-white shadow-md"
              style={{ 
                backgroundColor: dog.coat.primary,
                animationDelay: `${index * 0.3}s`
              }}
            ></div>
          ))}
          <span className="text-sm text-yellow-800 font-bold ml-3">Much Racing Now... 🏃‍♂️💨</span>
        </div>
      )}
    </div>
  );
};

export default RaceCard;