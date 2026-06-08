import { parseEgpAmount } from './money';

export function monthsBetweenInclusive(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const ms = end.getTime() - start.getTime();
  const days = Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)) + 1);
  return Math.max(1, Math.ceil(days / 30));
}

export function estimateCampaignAmountEgp(pricePerMonth, startDate, endDate) {
  const monthly = parseEgpAmount(pricePerMonth);
  const months = monthsBetweenInclusive(startDate, endDate);
  return monthly * months;
}
