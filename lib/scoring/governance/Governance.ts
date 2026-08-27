export function calculateGovernance(metricScores: number[]): number | null {
  if (metricScores.length === 0) {
    return null;
  }

  const metricSum = metricScores.reduce((sum, current) => sum + current, 0);

  const GovernanceScore = metricSum / metricScores.length;

  return GovernanceScore;
}
