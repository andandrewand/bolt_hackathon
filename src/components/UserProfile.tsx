import React, { useEffect, useMemo, useState } from "react";
import { UserStats } from "../types/racing";
import { TrendingUp, Target, Trophy, TrendingDown } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useLazyProfileQuery } from "../apis/profile";
import { ModalWinRate, UserProfileReponse } from "../modals";
import { get } from "../utils";

interface UserProfileProps {
  stats: UserStats;
  setModalWinRate: React.Dispatch<React.SetStateAction<ModalWinRate[]>>;
  setUserBalance: React.Dispatch<React.SetStateAction<number>>;
}

const UserProfile: React.FC<UserProfileProps> = ({
  stats,
  setModalWinRate,
  setUserBalance,
}) => {
  const [getUserProfile] = useLazyProfileQuery();
  const { UserId, sessionId } = useSelector((state: RootState) => state.login);

  const [userProfile, setUserProfile] = useState<UserProfileReponse>({
    user: {
      balance: 0,
      userId: "",
      username: "",
      winRate: 0,
      totalEarning: 0,
      modelWinRates: [],
    },
  });

  useMemo(() => {
    const change = get("change");
    if (change && change !== "change" && UserId) {
      (async () => {
        await getUserProfile({ userId: UserId });
      })();
    }
  }, [get("change")]);

  useEffect(() => {
    if (sessionId && UserId) {
      (async () => {
        try {
          const { data: userData } = await getUserProfile({
            userId: UserId,
          });
          if (userData) {
            setUserProfile(userData);
            setUserBalance(userData.user.balance);
            setModalWinRate(userData.user.modelWinRates);
          }
        } catch (e) {
          console.error("Error retrieving user profile:", e);
        }
      })();
    }
  }, [sessionId, UserId, get("change")]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-200">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        {userProfile.user.username
          .charAt(0)
          .toUpperCase()
          .concat(
            userProfile.user.username.substring(
              1,
              userProfile.user.username.length
            )
          )}
        's Performance
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center justify-center mb-2">
            {/* <DollarSign className="w-5 h-5 text-orange-600 mr-1" /> */}
            <img
              src="https://www.cdnlogo.com/logos/a/96/algorand.svg"
              draggable={false}
              width={35}
              height={35}
              alt="Algorand logo"
            />
            <span className="text-xl font-bold text-gray-900">
              {userProfile.user.balance.toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-gray-600 font-medium">
            Algorand Balance
          </div>
        </div>

        <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-5 h-5 text-orange-600 mr-1" />
            <span className="text-xl font-bold text-gray-900">
              {userProfile.user.winRate}%
            </span>
          </div>
          <div className="text-xs text-gray-600 font-medium">Win Rate</div>
        </div>

        <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="w-5 h-5 text-orange-600 mr-1" />
            <span className="text-xl font-bold text-gray-900">
              {stats.totalBets}
            </span>
          </div>
          <div className="text-xs text-gray-600 font-medium">Total Bets</div>
        </div>

        <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center justify-center mb-2">
            {userProfile.user.totalEarning > 0 ? (
              <TrendingUp className="w-5 h-5 text-orange-600 mr-1" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600 mr-1" />
            )}

            <span
              className={`text-xl font-bold ${
                userProfile.user.totalEarning >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {userProfile.user.totalEarning >= 0 ? "+" : ""}
              {userProfile.user.totalEarning.toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-gray-600 font-medium">
            Total Earnings
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
