import { mlModels } from "../data/mockData";
import { BidHistoryResponse } from "../modals";
import { MLModel } from "../types/racing";

export const BidHistory = ({ userBid }: BidHistoryResponse) => {
  return (
    <>
      <h4 className="font-medium text-gray-900 mb-2">{userBid.payoutAmount > 0 ? 'Bet Won' : 'Bet Lost'}</h4>
      <div className="flex flex-row">
        <iframe
          src={
            userBid.bidAmount > 0
              ? "https://tenor.com/embed/16435335956387921912"
              : "https://tenor.com/embed/8680118710179439060"
          }
          width="300"
          height="300"
          style={{
            pointerEvents: "none",
            width: 70,
            height: 70,
            paddingBottom: 5,
          }}
          frameBorder="0"
          allowFullScreen
        ></iframe>
        {/** */}
        <div className="flex-1 justify-between">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Bit Amount:</span>
            <span className="font-medium">
              <span>{userBid.bidAmount.toFixed(2)}</span>
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Payout:</span>
            <span className="font-medium flex">
              <img
                src="https://www.cdnlogo.com/logos/a/96/algorand.svg"
                draggable={false}
                width={20}
                height={20}
                alt="Algorand logo"
              />
              <span>{userBid.payoutAmount.toFixed(2)}</span>
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Modal:</span>
            <span className="font-medium">
              <span>
                {
                  mlModels.find(
                    (modal: MLModel) => modal.modal === userBid.prediction
                  )?.name
                }
              </span>
            </span>
          </div>
        </div>

        {/** */}
      </div>
    </>
  );
};
