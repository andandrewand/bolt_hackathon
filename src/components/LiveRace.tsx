import React from "react";
import { Race, Bet } from "../types/racing";
import { Clock, DollarSign, Zap, Play } from "lucide-react";
import LiveRaceAnimation from "./LiveRaceAnimation";
import { get, getHashRoundId, pad, save, shuffle } from "../utils";
import { ModalInfo, ModalWinRate, SessionList } from "../modals";
import { useCountdown } from "../hooks/useCountdown";

interface LiveRaceProps {
  race: Race;
  onPlaceBet: () => void;
  currentBet?: Bet | null;
  scheduledRace: SessionList[];
  modalWinRate: ModalWinRate[];
  currentDogePrice: number;
  setCurrentRace: React.Dispatch<React.SetStateAction<Race | null>>;
}

const LiveRace: React.FC<LiveRaceProps> = ({
  race,
  onPlaceBet,
  currentBet,
  scheduledRace,
  modalWinRate,
  currentDogePrice,
  setCurrentRace,
}) => {
  const {
    timeLeft: { minutes, seconds },
  } = useCountdown(
    scheduledRace && scheduledRace.length > 0
      ? scheduledRace[0].candleTimestamp
      : ""
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  (() => {
    if (minutes === 4 && seconds < 45 && seconds > 43) {
      save("change", shuffle("change".split("")).join(""));
      return;
    }

    if (minutes === 0 && seconds === 0) {
      //racing ongoing
      save("status", "running");
      return;
    }

    if (minutes === 0 && seconds < 59) {
      //stop betting
      save("status", "locked");
      return;
    }

    
  })();

  const getStatusColor = () => {
    switch (get("status")) {
      case "betting":
        return "bg-green-500";
      case "locked":
        return "bg-yellow-500";
      case "running":
        return "bg-red-500 animate-pulse";
      case "finished":
        return "bg-gray-500";
      default:
        return "bg-orange-500";
    }
  };

  const getStatusText = () => {
    // 'new' | 'betting' | 'locked' | 'running' | 'finished';
    switch (get("status")) {
      case "new":
        return "Betting Open";
      case "locked":
        return "Betting Locked";
      case "betting":
        return "Betting Locked";
      case "running":
        return "Race Running";
      case "finished":
        return "Race Finished";
      default:
        return "Upcoming";
    }
  };

  const getRobotDogeEmoji = (modelId: string) => {
    switch (modelId) {
      case "satoshi-shibe":
        return "🤖🐕"; // Conservative robot doge
      case "moondoggie":
        return "🚀🐕"; // Aggressive rocket doge
      case "sheba-fomo":
        return "📈🐕"; // Trend following doge
      default:
        return "🤖";
    }
  };

  const getModalInfo = (name: string) => {
    if (modalWinRate.length > 0) {
      return modalWinRate.find((mwr: ModalWinRate) => mwr.modelName === name);
    }

    return {
      modelName: "placeholder",
      winRate: 0,
    } as ModalWinRate;
  };

  const getModalConfidence = (name: string) => {
    if (scheduledRace.length > 0) {
      return scheduledRace[0].models.find(
        (model: ModalInfo) => model.modelName === name
      );
    }

    return {
      prediction: "0.00",
    } as const;
  };

  return (
    <div className="space-y-8">
      {/* Race Header */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-xl p-8 border-2 border-orange-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Zap className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{`Race #${getHashRoundId(
                scheduledRace.length > 0 ? scheduledRace[0].roundId : null
              )}`}</h2>
              <p className="text-orange-600">
                AI battle. Doge price. You bet who's right.
              </p>
            </div>
          </div>
          <div
            className={`px-4 py-2 rounded-full text-white font-bold ${getStatusColor()}`}
          >
            {getStatusText()}
          </div>
        </div>

        {/* Current Price & Timer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-orange-200 text-center">
            <div className="flex items-center justify-center mb-2">
              {/* <DollarSign className="w-6 h-6 text-green-600 mr-2" /> */}
              <span className="text-sm font-medium text-gray-600">
                Current DOGE Price
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              Ð {currentDogePrice ? currentDogePrice.toFixed(5) : "0.00"}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-orange-200 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-6 h-6 text-orange-600 mr-2" />
              <span className="text-sm font-medium text-gray-600">
                Time Remaining
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {/* {formatTime(race.timeRemaining)} */}
              {pad(isNaN(minutes) ? 0 : minutes)}:
              {pad(isNaN(seconds) ? 0 : seconds)}
            </div>
          </div>
        </div>

        {/* Robot Doge AI Models */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {race.models.map((model) => (
            <div
              key={model.id}
              className="bg-white rounded-xl p-6 border-2 border-orange-200 hover:border-orange-300 transition-colors"
            >
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-lg text-2xl"
                  style={{ backgroundColor: model.color }}
                >
                  {getRobotDogeEmoji(model.id)}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {model.name}
                </h3>
                <p className="text-sm text-orange-600 mb-3 font-medium">
                  {model.personality}
                </p>
                {model.prediction && (
                  <div className="space-y-2">
                    <div className="text-xl font-bold text-gray-900">
                      Ð{" "}
                      {parseFloat(
                        (
                          getModalConfidence(model.modal)?.prediction ?? 0.0
                        ).toString()
                      ).toFixed(5)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Confidence:{" "}
                      {Math.round(getModalInfo(model.modal)?.winRate ?? 0)}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.round(
                            getModalInfo(model.modal)?.winRate ?? 0
                          )}%`,
                          backgroundColor: model.color,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Current Bet Display */}
        {currentBet && (
          <div className="mb-6 bg-orange-100 border border-orange-300 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-orange-800 font-medium flex">
                Your bet:
                <img
                  src="https://www.cdnlogo.com/logos/a/96/algorand.svg"
                  draggable={false}
                  width={25}
                  height={25}
                  alt="Algorand logo"
                />
                {currentBet.amount} on{" "}
                {race.models.find((e) => e.modal === currentBet?.modelId)?.name}
              </div>
              <div className="text-orange-600 font-bold">
                Potential win: Ð {(currentBet.payout ?? 0.0).toFixed(5)}
              </div>
            </div>
          </div>
        )}

        {/* Place Bet Button */}
        {get("status") === "new" && !currentBet && (
          <div className="text-center">
            <button
              onClick={onPlaceBet}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 inline mr-2" />
              Place Your Bet
            </button>
          </div>
        )}

        {get("status") === "locked" && (
          <div className="text-center">
            <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-4">
              <p className="text-yellow-800 font-medium">
                Betting is now locked. Race starting soon...
              </p>
            </div>
          </div>
        )}

        {get("status") === "running" && (
          <div className="text-center">
            <div className="bg-red-100 border border-red-300 rounded-xl p-4">
              <p className="text-red-800 font-medium animate-pulse">
                🏁 Race in progress! Waiting for final price...
              </p>
            </div>
          </div>
        )}

        {/* {get("status") === "finished" && (
          <div className="text-center">
            <div className="bg-green-100 border border-green-300 rounded-xl p-4">
              <p className="text-green-800 font-bold text-lg">
                🏆 Winner: {race.models.find((m) => m.id === race.winner)?.name}
                !
              </p>
              <p className="text-green-700 mt-1">
                Final price: ${race.targetPrice?.toFixed(5)}
              </p>
            </div>
          </div>
        )} */}
      </div>

      {/* Live Race Animation */}
      <LiveRaceAnimation
        race={race}
        currentDogePrice={currentDogePrice}
        isActive={get("status") === "running" || get("status") === "locked"}
      />
    </div>
  );
};

export default LiveRace;
