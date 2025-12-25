
/**
 * Utility for handling Sealed Bid cryptography and masking.
 * In a real scenario, this would handle AES-256 decryption.
 */

export const sealBid = (amount: number, isSealed: boolean): string => {
  if (isSealed) {
    return "🔒 **********";
  }
  return `IDR ${amount.toLocaleString('id-ID')}`;
};

export const canOpenBids = (bidOpeningDate?: string): boolean => {
  if (!bidOpeningDate) return true;
  return new Date() >= new Date(bidOpeningDate);
};
