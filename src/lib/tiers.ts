export type Tier = "Sprout" | "Bloom" | "Harvest" | "Legacy";

export function getTier(points: number): Tier {
  if (points >= 4000) return "Legacy";
  if (points >= 1501) return "Harvest";
  if (points >= 501) return "Bloom";
  return "Sprout";
}

export const TIER_MULTIPLIERS: Record<Tier, number> = {
  Sprout: 1,
  Bloom: 1.25,
  Harvest: 1.5,
  Legacy: 2,
};

export const TIER_THRESHOLDS = [
  { tier: "Sprout", min: 0, max: 500 },
  { tier: "Bloom", min: 501, max: 1500 },
  { tier: "Harvest", min: 1501, max: 4000 },
  { tier: "Legacy", min: 4001, max: Infinity },
] as const;

export function calcPoints(orderTotal: number, tier: Tier, byot: boolean): number {
  const multiplier = TIER_MULTIPLIERS[tier];
  const byotBonus = byot ? (tier === "Legacy" ? 50 : tier === "Harvest" ? 30 : tier === "Bloom" ? 20 : 10) : 0;
  return Math.floor(Math.floor(orderTotal / 10) * multiplier) + byotBonus;
}
