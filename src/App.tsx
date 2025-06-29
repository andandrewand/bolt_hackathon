import { useState, useEffect } from "react";
import { Race, UserStats, Bet, PastRace } from "./types/racing";
import {
  mockUserStats,
  mockPastRaces,
  generateMockPrice,
  generateMLPredictions,
} from "./data/mockData";
import LoginPage from "./components/LoginPage";
import UserProfile from "./components/UserProfile";
import LiveRace from "./components/LiveRace";
import BettingModal from "./components/BettingModal";
import PastRaces from "./components/PastRaces";
import { LogOut } from "lucide-react";
import { useLoginCredentialsMutation } from "./apis/login";
import { useDispatch, useSelector } from "react-redux";
import { removeSession, saveSession } from "./slices/loginSlice";
import { RootState } from "./store";
import { ModalWinRate, SessionList } from "./modals";
import { clear, clearItem, get, save } from "./utils";
import { useDogeSocket } from "./websockets/useDogeSocket";
import { useBidMutation } from "./apis/bid";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>(mockUserStats);
  const [currentRace, setCurrentRace] = useState<Race | null>(null);
  const [_, setPastRaces] = useState<PastRace[]>(mockPastRaces);
  const [currentBet, setCurrentBet] = useState<Bet | null>(null);
  const [showBettingModal, setShowBettingModal] = useState(false);
  const [raceCounter, setRaceCounter] = useState(3);
  const [scheduledRace, setScheduledRace] = useState<SessionList[]>([]);
  const [modalWinRate, setModalWinRate] = useState<ModalWinRate[]>([]);
  const [userBalance, setUserBalance] = useState<number>(0);

  const { UserId, sessionId } = useSelector((state: RootState) => state.login);

  const [placeBid] = useBidMutation();
  const [onHandleLogin] = useLoginCredentialsMutation();
  const dispatch = useDispatch();

  const { price, socket } = useDogeSocket(
    "wss://data-stream.binance.vision/ws"
  );

  const status = get("status");
  const storedBet = get("bet");

  useEffect(() => {
    if (UserId && sessionId) {
      setIsLoggedIn(true);
    }

    if (!status) {
      save("status", "new");
    }

    if (storedBet && !currentBet) {
      setCurrentBet(JSON.parse(storedBet));
    }
  }, [UserId, sessionId, status, storedBet]);

  useEffect(() => {
    const status = get("status");

    populateRaceDetails();

    if (isLoggedIn && status && status === "new") {
      setCurrentBet(null);
    }

    if (isLoggedIn && status && status === "finished") {
      let timeout = setTimeout(() => {
        //to show the winner
        save("status", "new");
        setCurrentBet(null);
        () => clearTimeout(timeout);
      }, 3000);
    }
  }, [get("status"), isLoggedIn]);

  const populateRaceDetails = () => {
    const currentPrice = generateMockPrice();
    const modelsWithPredictions = generateMLPredictions(currentPrice);

    const newRace: Race = {
      id: `race-${raceCounter.toString().padStart(3, "0")}`,
      name: `Race #${raceCounter.toString().padStart(3, "0")}`,
      startTime: new Date(),
      endTime: new Date(Date.now() + 5 * 60 * 1000),
      status: "betting",
      currentPrice,
      models: modelsWithPredictions,
      timeRemaining: 5 * 60, // 5 minutes
    };

    setCurrentRace(newRace);
    setRaceCounter((prev) => prev + 1);
  };

  const handleLogin = async (loginUsername: string, password: string) => {
    if (loginUsername && password) {
      try {
        const { data } = await onHandleLogin({
          userName: loginUsername,
          password: password,
        });

        if (data?.sessionId) {
          dispatch(
            saveSession({
              sessionId: data.sessionId,
              UserId: data.UserId,
            })
          );
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.error("Error logging in:", e);
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentRace(null);
    setCurrentBet(null);
    setUserStats(mockUserStats);
    setPastRaces(mockPastRaces);
    setRaceCounter(3);
    dispatch(removeSession());
    clear();
    socket?.close();
  };

  const handlePlaceBet = async (
    modelId: string,
    amount: number,
    payout: number
  ) => {
    if (!currentRace) return;

    const newBet: Bet = {
      id: Date.now().toString(),
      raceId: currentRace.id,
      modelId,
      amount,
      payout,
      timestamp: new Date(),
      status: "active",
    };

    setCurrentBet(newBet);
    save("status", "betting");
    save("bet", JSON.stringify(newBet));

    try {
      if (scheduledRace && scheduledRace.length > 0) {
        const roundId = scheduledRace[0].roundId;
        await placeBid({
          bidAmount: newBet.amount,
          prediction: newBet.modelId,
          roundId,
        });
      }
    } catch (e) {
      console.error("Error placing bid: ", e);
    }
    
    clearItem("bet");
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img
                src="/doge.jpeg"
                alt="Doge"
                className="w-10 h-10 rounded-full mr-3 border-2 border-orange-400"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DogeRace</h1>
                <p className="text-sm text-orange-600">
                  AI battle. Doge price. You bet who's right.
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* User Profile */}
          <UserProfile
            stats={userStats}
            setModalWinRate={setModalWinRate}
            setUserBalance={setUserBalance}
          />

          {/* Live Race */}
          {currentRace && (
            <LiveRace
              race={currentRace}
              onPlaceBet={() => setShowBettingModal(true)}
              currentBet={currentBet}
              scheduledRace={scheduledRace}
              modalWinRate={modalWinRate}
              currentDogePrice={parseFloat(price ?? "0")}
            />
          )}

          {/* Past Races */}
          <PastRaces setScheduledRace={setScheduledRace} />
        </div>
      </main>

      {/* Betting Modal */}
      {currentRace && (
        <BettingModal
          race={currentRace}
          isOpen={showBettingModal}
          scheduledRace={scheduledRace}
          onClose={() => setShowBettingModal(false)}
          onPlaceBet={handlePlaceBet}
          userBalance={userBalance}
          modalWinRate={modalWinRate}
          currentDogePrice={parseFloat(price ?? "0")}
        />
      )}
    </div>
  );
}

export default App;
