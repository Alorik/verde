export function normalizeToMWh(unitsConsumed: number, unit: string): number {
  const normalizedUnit = unit.trim().toLowerCase();

  switch (normalizedUnit) {
    case "wh":
      return unitsConsumed / 1_000_000;

    case "kwh":
      return unitsConsumed / 1_000;

    case "mwh":
      return unitsConsumed;

    default:
      throw new Error(`Unsupported electricity unit: ${unit}`);
  }
}
