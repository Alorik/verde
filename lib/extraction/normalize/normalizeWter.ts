export function normalizeToCubicMeter(
  unitsConsumed: number,
  unit: string,
): number {
  const normalizedUnit = unit.trim().toLowerCase();

  switch (normalizedUnit) {
    case "l":
    case "liter":
    case "liters":
    case "litre":
    case "litres":
      return unitsConsumed / 1_000; // 1,000 L = 1 m³

    case "kl":
    case "kiloliter":
    case "kiloliters":
      return unitsConsumed; // 1 kL = 1 m³

    case "m3":
    case "m³":
    case "cubic_meter":
    case "cubic meter":
    case "cubic meters":
      return unitsConsumed; // already in m³

    case "gal":
    case "gallon":
    case "gallons":
      return unitsConsumed * 0.00378541; // 1 US gallon = 0.00378541 m³

    default:
      throw new Error(`Unsupported water unit: ${unit}`);
  }
}
