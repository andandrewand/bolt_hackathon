import React, { useState, useEffect } from 'react';
import { Race } from '../types/racing';
import DogAnimation from './DogAnimation';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

interface LiveRaceTrackerProps {
  race: Race;
  onRaceComplete?: (results: any[]) => void;
}

const LiveRaceTracker: React.FC<LiveRaceTrackerProps> = ({ race, onRaceComplete }) => {
  const [dogPositions, setDogPositions] = useState<{ [key: string]: number }>({});
  const [isRunning, setIsRunning] = useState(true);
  const [raceFinished, setRaceFinished] = useState(false);
  const [leaderboard, setLeaderboard] = useState<string[]>([]);

  useEffect(() => {
    // Initialize positions
    const initialPositions: { [key: string]: number } = {};
    race.dogs.forEach(dog => {
      initialPositions[dog.id] = Math.random() * 5; // Random start
    });
    setDogPositions(initialPositions);
  }, [race.dogs]);

  useEffect(() => {
    if (!isRunning || raceFinished) return;

    const interval = setInterval(() => {
      setDogPositions(prev => {
        const newPositions = { ...prev };
        let raceComplete = false;
        const finishedDogs: string[] = [];

        race.dogs.forEach(dog => {
          const currentPos = prev[dog.id] || 0;
          const speed = 0.8 + Math.random() * 2.5; // Variable speed for dogs
          const newPos = Math.min(currentPos + speed, 100);
          
          newPositions[dog.id] = newPos;
          
          if (newPos >= 100) {
            finishedDogs.push(dog.id);
            raceComplete = true;
          }
        });

        // Update leaderboard
        const sortedDogs = race.dogs
          .map(dog => ({ id: dog.id, position: newPositions[dog.id] }))
          .sort((a, b) => b.position - a.position)
          .map(item => item.id);
        
        setLeaderboard(sortedDogs);

        if (raceComplete && finishedDogs.length > 0) {
          setRaceFinished(true);
          setIsRunning(false);
          
          // Generate final results
          const results = sortedDogs.map((dogId, index) => ({
            position: index + 1,
            dogId,
            time: `0:${(28 + Math.random() * 8).toFixed(2)}`,
            margin: index === 0 ? '' : `${(Math.random() * 2).toFixed(1)}`
          }));
          
          onRaceComplete?.(results);
        }

        return newPositions;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isRunning, raceFinished, race.dogs, onRaceComplete]);

  const toggleRace = () => {
    setIsRunning(!isRunning);
  };

  const resetRace = () => {
    const resetPositions: { [key: string]: number } = {};
    race.dogs.forEach(dog => {
      resetPositions[dog.id] = Math.random() * 5;
    });
    setDogPositions(resetPositions);
    setRaceFinished(false);
    setIsRunning(true);
    setLeaderboard([]);
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-2xl p-8 border-4 border-green-300">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Zap className="w-8 h-8 text-yellow-500 mr-3 animate-bounce" />
          <h2 className="text-3xl font-bold text-gray-900">LIVE DOGE RACE • MUCH EXCITE</h2>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={toggleRace}
            className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 border-2 ${
              isRunning 
                ? 'bg-red-500 text-white hover:bg-red-600 border-red-600 animate-pulse' 
                : 'bg-green-500 text-white hover:bg-green-600 border-green-600'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 inline mr-2" />
                PAUSE WOW
              </>
            ) : (
              <>
                <Play className="w-5 h-5 inline mr-2" />
                RESUME SUCH
              </>
            )}
          </button>
          <button
            onClick={resetRace}
            className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all font-bold transform hover:scale-105 border-2 border-gray-700"
          >
            <RotateCcw className="w-5 h-5 inline mr-2" />
            RESET VERY
          </button>
        </div>
      </div>

      {raceFinished && (
        <div className="mb-6 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 border-4 border-yellow-400 rounded-2xl shadow-lg">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-yellow-800 mb-2">🏆 RACE FINISHED! MUCH WOW! 🏆</h3>
            <p className="text-xl text-yellow-700 font-bold">
              Winner: {race.dogs.find(h => h.id === leaderboard[0])?.name} • SUCH CHAMPION!
            </p>
            <div className="mt-2 text-lg text-yellow-600">
              🎉 Very Victory • So Fast • Much Celebrate 🎉
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {race.dogs.map((dog, index) => {
          const position = dogPositions[dog.id] || 0;
          const currentRank = leaderboard.indexOf(dog.id) + 1;
          const isLeading = currentRank === 1 && position > 10;
          
          return (
            <DogAnimation
              key={dog.id}
              position={currentRank}
              progress={position}
              color={dog.coat.primary}
              name={dog.name}
              isLeading={isLeading}
            />
          );
        })}
      </div>

      {/* Race statistics */}
      <div className="mt-8 grid grid-cols-3 gap-6">
        <div className="p-4 bg-white rounded-xl shadow-lg border-2 border-yellow-300 text-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {Math.max(...Object.values(dogPositions)).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 font-bold">MUCH PROGRESS</div>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-lg border-2 border-orange-300 text-center">
          <div className="text-lg font-bold text-gray-900 mb-1">
            {leaderboard.length > 0 ? race.dogs.find(h => h.id === leaderboard[0])?.name : 'N/A'}
          </div>
          <div className="text-sm text-gray-600 font-bold">SUCH LEADER</div>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-lg border-2 border-green-300 text-center">
          <div className="text-lg font-bold text-gray-900 mb-1">
            {raceFinished ? '🏁 FINISHED' : isRunning ? '🏃 RUNNING' : '⏸️ PAUSED'}
          </div>
          <div className="text-sm text-gray-600 font-bold">VERY STATUS</div>
        </div>
      </div>
    </div>
  );
};

export default LiveRaceTracker;