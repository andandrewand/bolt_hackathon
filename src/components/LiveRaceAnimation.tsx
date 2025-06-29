import React, { useState, useEffect } from "react";
import { Race } from "../types/racing";
import { get, save } from "../utils";

interface LiveRaceAnimationProps {
  race: Race;
  isActive: boolean;
  currentDogePrice: number;
}

const LiveRaceAnimation: React.FC<LiveRaceAnimationProps> = ({
  race,
  isActive,
  currentDogePrice,
}) => {
  const [positions, setPositions] = useState<{ [key: string]: number }>({});
  const [leader, setLeader] = useState<string>("");

  // Initialize positions
  useEffect(() => {
    const initialPositions: { [key: string]: number } = {};
    race.models.forEach((model) => {
      initialPositions[model.id] = 0;
    });
    setPositions(initialPositions);
  }, [race.models]);

  // Animate positions during race
  useEffect(() => {
    if (!isActive || get("status") !== "running") return;

    const interval = setInterval(() => {
      setPositions((prev) => {
        const newPositions = { ...prev };
        let currentLeader = "";
        let maxPosition = 0;

        race.models.forEach((model) => {
          // Different speeds based on how close their prediction is to current price
          const accuracy = model.prediction
            ? Math.abs(race.currentPrice - model.prediction) / race.currentPrice
            : 0.5;

          // Better accuracy = faster speed (inverted)
          const baseSpeed = 0.8 + (1 - accuracy) * 1.5;
          const randomVariation = 0.5 + Math.random() * 0.5;
          const speed = baseSpeed * randomVariation;

          const currentPos = prev[model.id] || 0;
          const newPos = Math.min(currentPos + speed, 100);
          newPositions[model.id] = newPos;

          if (newPos > maxPosition) {
            maxPosition = newPos;
            currentLeader = model.id;
          }
        });

        setLeader(currentLeader);
        return newPositions;
      });
    }, 100);

    setTimeout(() => {
      save("status", "finished");
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive, race.status, race.models, race.currentPrice, get("status")]);

  const getRobotDogeEmoji = (modelId: string) => {
    switch (modelId) {
      case "satoshi-shibe":
        return "🤖🐕";
      case "moondoggie":
        return "🚀🐕";
      case "sheba-fomo":
        return "📈🐕";
      default:
        return "🤖";
    }
  };

  const getTrackPosition = (position: number) => {
    // Convert 0-100 to circular track position
    const angle = (position / 100) * 360;
    const radius = 120;
    const centerX = 150;
    const centerY = 150;

    const x = centerX + radius * Math.cos(((angle - 90) * Math.PI) / 180);
    const y = centerY + radius * Math.sin(((angle - 90) * Math.PI) / 180);

    return { x, y, angle };
  };

  if (!isActive) {
    return (
      <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-8 border-2 border-orange-200">
        <div className="text-center text-gray-600">
          <div className="text-4xl mb-4">🏁</div>
          <p className="text-lg font-medium">
            Race will start when betting locks...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-8 border-2 border-orange-200">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          🏁 Live Race Track 🏁
        </h3>
        <p className="text-orange-600">
          Robot Doges racing to predict the price!
        </p>
      </div>

      {/* Circular Race Track */}
      <div
        className="relative mx-auto"
        style={{ width: "300px", height: "300px" }}
      >
        {/* Track Background */}
        <svg width="300" height="300" className="absolute inset-0">
          {/* Outer track */}
          <circle
            cx="150"
            cy="150"
            r="140"
            fill="none"
            stroke="#10B981"
            strokeWidth="40"
            className="opacity-30"
          />
          {/* Inner track */}
          <circle
            cx="150"
            cy="150"
            r="120"
            fill="none"
            stroke="#059669"
            strokeWidth="4"
            strokeDasharray="10,5"
            className="opacity-60"
          />
          {/* Finish line */}
          <line
            x1="150"
            y1="30"
            x2="150"
            y2="70"
            stroke="#EF4444"
            strokeWidth="6"
            className="animate-pulse"
          />
          {/* Track markers */}
          {[0, 90, 180, 270].map((angle, index) => (
            <g key={index}>
              <line
                x1={150 + 100 * Math.cos(((angle - 90) * Math.PI) / 180)}
                y1={150 + 100 * Math.sin(((angle - 90) * Math.PI) / 180)}
                x2={150 + 140 * Math.cos(((angle - 90) * Math.PI) / 180)}
                y2={150 + 140 * Math.sin(((angle - 90) * Math.PI) / 180)}
                stroke="#374151"
                strokeWidth="2"
                className="opacity-40"
              />
            </g>
          ))}
        </svg>

        {/* Racing Robot Doges */}
        {race.models.map((model, index) => {
          const position = positions[model.id] || 0;
          const trackPos = getTrackPosition(position);
          const isLeading = leader === model.id;

          return (
            <div
              key={model.id}
              className={`absolute transition-all duration-100 ease-linear ${
                isLeading ? "animate-bounce" : ""
              }`}
              style={{
                left: `${trackPos.x - 20}px`,
                top: `${trackPos.y - 20}px`,
                transform: `rotate(${trackPos.angle}deg)`,
                zIndex: isLeading ? 10 : 5,
              }}
            >
              {/* Robot Doge */}
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border-4 border-white shadow-lg ${
                    isLeading ? "animate-pulse" : ""
                  }`}
                  style={{ backgroundColor: model.color }}
                >
                  {getRobotDogeEmoji(model.id)}
                </div>

                {/* Speed lines for leader */}
                {isLeading && (
                  <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
                    <div className="flex space-x-1">
                      <div className="w-3 h-1 bg-yellow-400 rounded animate-ping"></div>
                      <div
                        className="w-2 h-1 bg-yellow-500 rounded animate-ping"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Leader crown */}
                {isLeading && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-yellow-500 animate-bounce">
                    👑
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Center Info */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-lg border-4 border-orange-300">
            <div className="text-xs font-bold text-gray-600">DOGE</div>
            <div className="text-sm font-bold text-gray-900">
              Ð {currentDogePrice.toFixed(5)}
            </div>
            <div className="text-xs text-orange-600">LIVE</div>
          </div>
        </div>
      </div>

      {/* Race Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {race.models.map((model) => {
          const position = positions[model.id] || 0;
          const isLeading = leader === model.id;

          return (
            <div
              key={model.id}
              className={`p-3 rounded-lg border-2 text-center ${
                isLeading
                  ? "bg-yellow-100 border-yellow-400 animate-pulse"
                  : "bg-white border-orange-200"
              }`}
            >
              <div className="text-xl mb-1">{getRobotDogeEmoji(model.id)}</div>
              <div className="text-sm font-bold text-gray-900">
                {model.name}
              </div>
              <div className="text-xs text-orange-600 mb-1">
                {model.personality}
              </div>
              <div className="text-sm font-bold" style={{ color: model.color }}>
                {position.toFixed(1)}%
              </div>
              {isLeading && (
                <div className="text-xs text-yellow-600 font-bold animate-bounce">
                  🏆 LEADING!
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Spectator Crowd */}
      <div className="mt-4 text-center">
        <div className="text-2xl animate-bounce">
          👥 👥 👥 CROWD CHEERING! 👥 👥 👥
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Much excitement! Very race! Wow speed!
        </div>
      </div>
    </div>
  );
};

export default LiveRaceAnimation;
