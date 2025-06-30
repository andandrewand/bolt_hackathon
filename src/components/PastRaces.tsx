import React, { useEffect, useState } from "react";
import { MLModel } from "../types/racing";
import {
  ChevronDown,
  ChevronUp,
  Trophy,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useBidHistoryMutation, useSessionsQuery } from "../apis/bid";
import { BidHistoryRequest, ModalInfo, SessionList } from "../modals";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import {get, getHashRoundId, save } from "../utils";
import { mlModels } from "../data/mockData";

interface PastRacesProps {
  setScheduledRace: React.Dispatch<React.SetStateAction<SessionList[]>>;
}

const PastRaces: React.FC<PastRacesProps> = ({ setScheduledRace }) => {
  const [expandedRace, setExpandedRace] = useState<string | null>(null);
  const { UserId } = useSelector((state: RootState) => state.login);
  const {
    data: sortedRaces,
    isSuccess,
    isError,
    refetch,
  } = useSessionsQuery({ limit: 10 }, { pollingInterval: 0 });

  const [callBidHistory] = useBidHistoryMutation();

  useEffect(() => {
    if (
      sortedRaces &&
      sortedRaces.scheduled.length > 0
    ) {
      setScheduledRace(sortedRaces.scheduled);
      save("status", "new");
      return;
    }

    save("status", "upcoming");
  }, [sortedRaces, isSuccess, isError]);

  useEffect(() => {
    const change = get("change");
    if (change && change !== "change" && (isSuccess || isError)) {
      (async () => {
        try {
          const response = await refetch();
          if (response.data && response.data.scheduled.length > 0) {
            save("status", "new");
            return;
          }
          save("status", "upcoming");
        } catch (e) {}
      })();
    }
  }, [get("change")]);

  const toggleExpanded = (raceId: string) => {
    setExpandedRace(expandedRace === raceId ? null : raceId);
  };

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

  const getPriceMovement = (roundId: string) => {
    if (sortedRaces && sortedRaces.sessions.length > 0) {
      const listOfModals = sortedRaces.sessions.find(
        (session: SessionList) => session.roundId === roundId
      );
      if (listOfModals && listOfModals.models.length > 0) {
        const firstModal = listOfModals.models[0];
        const prev = parseFloat(firstModal.previousClose).toFixed(5);

        const actual = parseFloat(firstModal.actualClose ?? "0").toFixed(5);

        const diff = parseFloat(actual) - parseFloat(prev);

        return {
          ...firstModal,
          previousClose: prev,
          difference: ((diff / parseFloat(prev)) * 100).toFixed(2),
          actualClose: actual,
        } as const;
      }
    }

    return {
      previousClose: "0.00",
      difference: "0.00",
      actualClose: "0.00",
    } as const;
  };

  const bidHistory = async ({ roundId, userId }: BidHistoryRequest) => {
    try {
      const response = await callBidHistory({ roundId, userId });
      console.log("bid history resp ", response); //TODO: add users bid winnings
    } catch (e) {
      console.error("Error in bid history: ", e);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-orange-200">
      <div className="p-6 border-b border-orange-200">
        <h2 className="text-xl font-bold text-gray-900">Recent Races</h2>
        <p className="text-gray-600 text-sm">Click to view race details</p>
      </div>
      <div className="divide-y divide-orange-100">
        {sortedRaces &&
          sortedRaces.sessions.map((race, idx: number) => {
            // const priceChange = getPriceChange(race.startPrice, race.endPrice);
            const isExpanded = expandedRace === idx.toString();

            return (
              <div key={idx} className="transition-all duration-200">
                {/* Race Summary */}
                <div
                  className="p-4 hover:bg-orange-50 cursor-pointer"
                  onClick={async () => {
                    toggleExpanded(idx.toString());
                    await bidHistory({
                      roundId: race.roundId,
                      userId: UserId!,
                    });
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Trophy className="w-5 h-5 text-orange-500 mr-2" />
                        <span className="font-medium text-gray-900">
                          {/* {race.statuslabel} */}
                          {`Race #${getHashRoundId(race.roundId)}`}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {race.candleTimestamp}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          Ð{" "}
                          {parseFloat(
                            getPriceMovement(race.roundId).actualClose
                          ).toFixed(5)}
                        </div>
                        <div
                          className={`text-xs flex items-center ${
                            parseFloat(
                              getPriceMovement(race.roundId).difference
                            ) > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {parseFloat(
                            getPriceMovement(race.roundId).difference
                          ) > 0 ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {parseFloat(
                            getPriceMovement(race.roundId).difference
                          )}
                          %
                        </div>
                      </div>

                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 bg-orange-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-4 border border-orange-200">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Price Movement
                        </h4>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Previous Close:
                            </span>
                            <span className="font-medium">
                              <span>
                                {getPriceMovement(race.roundId).previousClose}
                              </span>
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Actual Close:</span>
                            <span className="font-medium">
                              <span>
                                {getPriceMovement(race.roundId).actualClose}
                              </span>
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Difference:</span>
                            <span className="font-medium">
                              <span
                                className={`${
                                  parseFloat(
                                    getPriceMovement(race.roundId).difference
                                  ) > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {parseFloat(
                                  getPriceMovement(race.roundId).actualClose
                                ) >
                                parseFloat(
                                  getPriceMovement(race.roundId).previousClose
                                )
                                  ? "+"
                                  : ""}
                                {getPriceMovement(race.roundId).difference}%
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-orange-200">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {race.models.filter(
                            (model: ModalInfo) => model.sessionStatus === "WIN"
                          ).length >= 1
                            ? "Winners"
                            : race.models.filter(
                                (model: ModalInfo) =>
                                  model.sessionStatus === "WIN"
                              ).length === 0
                            ? "No Winner"
                            : "Winner"}
                        </h4>
                        <div className="flex items-center">
                          {race.models.map((model: ModalInfo, idx: number) => {
                            const isWinner = model.sessionStatus === "WIN";
                            const charName = mlModels.find(
                              (char: MLModel) => char.modal === model.modelName
                            );
                            return (
                              isWinner && (
                                <div
                                  className="flex items-center pr-5"
                                  key={idx}
                                >
                                  <div className="text-2xl mr-3">
                                    {getRobotDogeEmoji(
                                      charName?.id ?? "others"
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {charName?.name ?? "others"}
                                    </div>
                                    <div className="text-sm text-orange-600">
                                      {charName?.personality ?? "others"}
                                    </div>
                                  </div>
                                </div>
                              )
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* All Predictions */}
                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                      <h4 className="font-medium text-gray-900 mb-3">
                        AI Predictions
                      </h4>
                      <div className="space-y-2">
                        {race.models.map((model: ModalInfo, idx: number) => {
                          const isWinner = model.sessionStatus === "WIN";
                          const charName = mlModels.find(
                            (char: MLModel) => char.modal === model.modelName
                          );

                          return (
                            <div
                              key={idx}
                              className={`flex items-center justify-between p-3 rounded ${
                                isWinner
                                  ? "bg-green-50 border border-green-200"
                                  : "bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center">
                                <div className="text-xl mr-3">
                                  {getRobotDogeEmoji(charName?.id ?? "others")}
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-900">
                                    {charName?.name ?? "others"}
                                  </span>
                                  {isWinner && (
                                    <Trophy className="w-4 h-4 text-yellow-500 ml-2 inline" />
                                  )}
                                  <div className="text-xs text-orange-600">
                                    {charName?.personality ?? "others"}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">
                                  Ð{" "}
                                  {parseFloat(
                                    model.prediction ?? "0.00"
                                  ).toFixed(5)}
                                </div>
                                <div className="text-xs text-gray-600">
                                  Off by{" "}
                                  {(
                                    (1 - parseFloat(model.accuracy ?? "0.00")) *
                                    100
                                  ).toFixed(2)}
                                  %
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* User Bet Info */}
                    {/* {race.userBet && (
                    <div className="mt-4 bg-white rounded-lg p-4 border border-orange-200">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Your Bet
                      </h4>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Bet {race.userBet.amount} DOGE on{" "}
                          {
                            race.models.find(
                              (m) => m.id === race.userBet?.modelId
                            )?.name
                          }
                        </div>
                        <div
                          className={`text-sm font-medium ${
                            race.userBet.status === "won"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {race.userBet.status === "won"
                            ? `Won ${race.userBet.payout} DOGE!`
                            : "Lost"}
                        </div>
                      </div>
                    </div>
                  )} */}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PastRaces;
