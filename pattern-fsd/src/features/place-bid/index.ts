export { BidPanel } from "./ui/BidPanel";
export { useBidSubmit } from "./model/useBidSubmit";

// Non-hook helper for external bid events (e.g. mock socket).
// Coordinates both auction and bid entities from the features layer.
import { useAuctionStore } from "@/entities/auction";
import { useBidStore } from "@/entities/bid";

export function placeExternalBid(amount: number, userName: string): void {
  const result = useAuctionStore.getState().acceptBid(amount);
  if (result.success) {
    useBidStore.getState().addBid({
      id: crypto.randomUUID(),
      userName,
      amount,
      timestamp: new Date(),
    });
  }
}
