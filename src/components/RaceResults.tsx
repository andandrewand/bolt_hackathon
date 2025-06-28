import React from 'react';
import { Race } from '../types/racing';
import { Trophy, Clock } from 'lucide-react';

interface RaceResultsProps {
  race: Race;
}

const RaceResults: React.FC<RaceResultsProps> = ({ race }) => {
  if (!race.results) return null;

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-200 to-yellow-300 text-yellow-900 border-yellow-500';
      case 2:
        return 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900 border-gray-500';
      case 3:
        return 'bg-gradient-to-r from-orange-200 to-orange-300 text-orange-900 border-orange-500';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-400';
    }
  };

  const getPositionEmoji = (position: number) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🐕';
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl shadow-2xl p-8 border-4 border-yellow-300">
      <div className="flex items-center mb-6">
        <Trophy className="w-8 h-8 text-yellow-600 mr-3 animate-bounce" />
        <h2 className="text-3xl font-bold text-gray-900">Race Results • Much Finish</h2>
      </div>

      <div className="space-y-4">
        {race.results.map((result) => {
          const dog = race.dogs.find(h => h.id === result.dogId);
          if (!dog) return null;

          return (
            <div
              key={result.dogId}
              className={`flex items-center justify-between p-6 rounded-2xl border-4 shadow-lg transform transition-all hover:scale-102 ${getPositionColor(result.position)}`}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-white border-4 border-current flex items-center justify-center font-bold text-xl mr-4 shadow-lg">
                  {getPositionEmoji(result.position)}
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <div
                      className="w-6 h-6 rounded-full mr-3 border-3 shadow-md"
                      style={{
                        backgroundColor: dog.coat.primary,
                        borderColor: dog.coat.secondary
                      }}
                    ></div>
                    <h3 className="text-xl font-bold">{dog.name}</h3>
                    {result.position === 1 && (
                      <span className="ml-3 px-3 py-1 bg-yellow-500 text-yellow-900 text-sm font-bold rounded-full animate-bounce">
                        SUCH WINNER! 🎉
                      </span>
                    )}
                  </div>
                  <p className="text-lg font-medium opacity-80">{dog.handler}</p>
                  <p className="text-sm font-bold opacity-70">{dog.personality}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center text-lg font-bold mb-2">
                  <Clock className="w-5 h-5 mr-2" />
                  {result.time}
                </div>
                {result.margin && (
                  <div className="text-sm font-bold opacity-70">
                    +{result.margin} lengths
                  </div>
                )}
                <div className="text-xs font-bold mt-1">
                  {result.position === 1 ? 'VERY FAST!' : 
                   result.position === 2 ? 'MUCH CLOSE!' : 
                   result.position === 3 ? 'SO GOOD!' : 'WOW EFFORT!'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RaceResults;