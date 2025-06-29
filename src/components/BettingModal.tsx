import React, { useState } from "react";
import { Race } from "../types/racing";
import { X } from "lucide-react";
import { ModalInfo, ModalWinRate, SessionList } from "../modals";
import { getHashRoundId } from "../utils";

interface BettingModalProps {
  race: Race;
  isOpen: boolean;
  onClose: () => void;
  onPlaceBet: (modelId: string, amount: number, payout: number) => void;
  userBalance: number;
  scheduledRace: SessionList[];
  modalWinRate: ModalWinRate[];
  currentDogePrice: number;
}

const BettingModal: React.FC<BettingModalProps> = ({
  race,
  isOpen,
  onClose,
  onPlaceBet,
  userBalance,
  scheduledRace,
  modalWinRate,
  currentDogePrice,
}) => {
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [betAmount, setBetAmount] = useState<number>(5);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payout = parseFloat(
      (getPotentialPayout(selectedModel).payoutRatio * betAmount).toString()
    ).toFixed(5);
    if (selectedModel && betAmount > 0 && betAmount <= userBalance) {
      onPlaceBet(selectedModel, betAmount, parseFloat(payout));
      onClose();
      setSelectedModel("");
      setBetAmount(5);
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

  const getModaWinRate = (name: string) => {
    if (modalWinRate && modalWinRate.length > 0) {
      return modalWinRate.find((mwr: ModalWinRate) => mwr.modelName === name);
    }

    return {
      modelName: "placeholder",
      winRate: 0,
    } as ModalWinRate;
  };

  const getModalConfidence = (name: string) => {
    if (scheduledRace && scheduledRace.length > 0) {
      return scheduledRace[0].models.find(
        (model: ModalInfo) => model.modelName === name
      );
    }

    return {
      prediction: "0.00",
    } as const;
  };

  const getPotentialPayout = (name: string) => {
    if (scheduledRace && scheduledRace.length > 0) {
      return {
        ...scheduledRace[0].models.find(
          (model: ModalInfo) => model.modelName === name
        ),
        payoutRatio:
          scheduledRace[0].models.find(
            (model: ModalInfo) => model.modelName === name
          )?.payoutRatio ?? 0.0,
      };
    }

    return {
      payoutRatio: 0.0,
    } as const;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-orange-200">
          <div className="flex items-center">
            <img
              src="/doge.jpeg"
              alt="Doge"
              className="w-8 h-8 rounded-full mr-3"
            />
            <h2 className="text-xl font-bold text-gray-900">Place Your Bet</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Race Info */}
          <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-center">
              <h3 className="font-bold text-gray-900 mb-2">
                {" "}
                Race #
                {scheduledRace && scheduledRace.length > 0
                  ? getHashRoundId(scheduledRace[0].roundId)
                  : "NEW"}
              </h3>
              <div className="text-sm text-gray-600">
                Current Price:{" "}
                <span className="font-bold">
                  Ð {currentDogePrice ? currentDogePrice.toFixed(5) : "0.00"}
                </span>
              </div>
            </div>
          </div>

          {/* Model Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose Your Robot Doge
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {race.models.map((model) => (
                <div
                  key={model.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedModel === model.modal
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                  onClick={() => setSelectedModel(model.modal)}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">
                      {getRobotDogeEmoji(model.id)}
                    </div>
                    <div className="font-medium text-gray-900 mb-1">
                      {model.name}
                    </div>
                    <div className="text-xs text-orange-600 mb-2">
                      {model.personality}
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      Ð{" "}
                      {parseFloat(
                        getModalConfidence(model.modal)?.prediction ?? "0.00"
                      ).toFixed(5)}
                    </div>
                    <div className="text-xs text-gray-600">
                      {Math.round(getModaWinRate(model.modal)?.winRate ?? 0)}%
                      confident
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bet Amount */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Bet Amount
            </label>
            <div className="relative">
              <img
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                src="https://www.cdnlogo.com/logos/a/96/algorand.svg"
                draggable={false}
                width={15}
                height={15}
                alt="Algorand logo"
              />
              {/* <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                min="1"
                max={userBalance}
                step="0.1"
                className="w-full pl-10 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[5, 10, 25, 50].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setBetAmount(amount)}
                  disabled={amount > userBalance}
                  className="py-3 text-sm bg-orange-100 text-orange-700 rounded hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {amount}
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-600 mt-2 flex">
              Balance:
              <img
                src="https://www.cdnlogo.com/logos/a/96/algorand.svg"
                draggable={false}
                width={25}
                height={25}
                alt="Algorand logo"
              />
              {userBalance.toFixed(2)}
            </div>
          </div>

          {/* Payout Info */}
          {selectedModel && betAmount > 0 && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Potential Payout:
                </span>
                <span className="text-xl font-bold text-green-700 flex">
                  <img
                    src="https://www.cdnlogo.com/logos/a/96/algorand.svg"
                    draggable={false}
                    width={30}
                    height={30}
                    alt="Algorand logo"
                  />
                  {parseFloat(
                    (
                      getPotentialPayout(selectedModel).payoutRatio * betAmount
                    ).toString()
                  ).toFixed(5)}
                </span>
              </div>
              <div className="text-sm text-green-600 mt-1">
                {parseFloat(
                  getPotentialPayout(selectedModel).payoutRatio.toString()
                ).toFixed(5)}
                x your bet if your AI wins!
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                !selectedModel || betAmount <= 0 || betAmount > userBalance
              }
              className="flex-1 py-4 px-6 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
            >
              Place Bet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BettingModal;
