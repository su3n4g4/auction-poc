// WebSocketのモック: setIntervalで他ユーザーからのランダム入札イベントを擬似発火

export type MockBidEvent = {
  userName: string;
  amount: number;
};

const MOCK_USERS = ["田中さん", "佐藤さん", "鈴木さん", "高橋さん", "伊藤さん"];
const BID_INTERVAL_MS = 5000;
const MAX_RANDOM_INCREMENT = 2000;

export function startMockSocket(
  currentPriceGetter: () => number,
  onBidEvent: (event: MockBidEvent) => void
): () => void {
  const intervalId = setInterval(() => {
    const currentPrice = currentPriceGetter();
    const increment = Math.floor(Math.random() * MAX_RANDOM_INCREMENT) + 100;
    const newAmount = currentPrice + increment;
    const userName = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];

    onBidEvent({ userName, amount: newAmount });
  }, BID_INTERVAL_MS);

  return () => clearInterval(intervalId);
}
