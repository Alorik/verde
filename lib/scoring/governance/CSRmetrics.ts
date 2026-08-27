import { prisma } from "@/lib/prisma";

type GovernanceMetricResult = {
  value: number;
  unit: string;
  rating: string;
  score: number;

  policyScore: number;
  policyRating: string;

  riskManagementScore: number;
  riskManagementRating: string;

  complianceScore: number;
  complianceRating: string;

  trainingScore: number;
  trainingRating: string;

  boardScore: number;
  boardRating: string;

  rawValue: number;
  sourceDocumentId: string;
};

export async function calculateGovernanceMetric(
  assessmentId: string,
): Promise<GovernanceMetricResult | null> {
  const currentDocument = await prisma.document.findFirst({
    where: {
      assessmentId,
      documentType: "CSR_REPORT",
      csrReport: {
        isNot: null,
      },
    },
    orderBy: {
      uploadedAt: "desc",
    },
    select: {
      id: true,
      csrReport: {
        select: {
          boardIndependence: true,
          ethicsPolicy: true,
          antiCorruptionPolicy: true,
          whistleblowerPolicy: true,
          riskManagement: true,
          regulatoryCompliance: true,
          governanceTraining: true,
          complianceIncidents: true,
        },
      },
    },
  });

  if (!currentDocument || !currentDocument.csrReport) {
    return null;
  }

  const {
    boardIndependence,
    ethicsPolicy,
    antiCorruptionPolicy,
    whistleblowerPolicy,
    riskManagement,
    regulatoryCompliance,
    governanceTraining,
    complianceIncidents,
  } = currentDocument.csrReport;

  const sourceDocumentId = currentDocument.id;

  // --------------------------------
  // Governance Policies
  // --------------------------------

  const policyValues = [
    ethicsPolicy,
    antiCorruptionPolicy,
    whistleblowerPolicy,
  ];

  const availablePolicies = policyValues.filter(
    (value): value is boolean => value !== null,
  );

  if (availablePolicies.length === 0) {
    return null;
  }

  const policyPercentage =
    (availablePolicies.filter(Boolean).length / availablePolicies.length) * 100;

  let policyRating = "";
  let policyScore = 0;

  if (policyPercentage === 100) {
    policyRating = "Excellent";
    policyScore = 100;
  } else if (policyPercentage >= 66) {
    policyRating = "Good";
    policyScore = 85;
  } else if (policyPercentage >= 33) {
    policyRating = "Average";
    policyScore = 70;
  } else {
    policyRating = "Poor";
    policyScore = 50;
  }

  // --------------------------------
  // Risk Management
  // --------------------------------

  let riskManagementRating = "";
  let riskManagementScore = 0;

  if (riskManagement === true) {
    riskManagementRating = "Excellent";
    riskManagementScore = 100;
  } else if (riskManagement === false) {
    riskManagementRating = "Poor";
    riskManagementScore = 50;
  } else {
    riskManagementRating = "Not Reported";
    riskManagementScore = 0;
  }

  // --------------------------------
  // Regulatory Compliance
  // --------------------------------

  let complianceScore = 0;
  let complianceRating = "";

  if (regulatoryCompliance === true && complianceIncidents === 0) {
    complianceRating = "Excellent";
    complianceScore = 100;
  } else if (regulatoryCompliance === true && complianceIncidents <= 2) {
    complianceRating = "Good";
    complianceScore = 85;
  } else if (regulatoryCompliance === true) {
    complianceRating = "Average";
    complianceScore = 70;
  } else if (regulatoryCompliance === false) {
    complianceRating = "Poor";
    complianceScore = 50;
  } else {
    complianceRating = "Not Reported";
    complianceScore = 0;
  }

  // --------------------------------
  // Governance Training
  // --------------------------------

  let trainingScore = 0;
  let trainingRating = "";

  if (governanceTraining === null) {
    trainingRating = "Not Reported";
    trainingScore = 0;
  } else if (governanceTraining >= 40) {
    trainingRating = "Excellent";
    trainingScore = 100;
  } else if (governanceTraining >= 30) {
    trainingRating = "Good";
    trainingScore = 85;
  } else if (governanceTraining >= 20) {
    trainingRating = "Average";
    trainingScore = 70;
  } else if (governanceTraining >= 10) {
    trainingRating = "Poor";
    trainingScore = 50;
  } else {
    trainingRating = "Very Poor";
    trainingScore = 25;
  }

  // --------------------------------
  // Board Independence
  // --------------------------------

  let boardScore = 0;
  let boardRating = "";

  if (boardIndependence === null) {
    boardRating = "Not Reported";
    boardScore = 0;
  } else if (boardIndependence >= 50) {
    boardRating = "Excellent";
    boardScore = 100;
  } else if (boardIndependence >= 40) {
    boardRating = "Good";
    boardScore = 85;
  } else if (boardIndependence >= 30) {
    boardRating = "Average";
    boardScore = 70;
  } else if (boardIndependence >= 20) {
    boardRating = "Poor";
    boardScore = 50;
  } else {
    boardRating = "Very Poor";
    boardScore = 25;
  }

  // --------------------------------
  // Overall Governance Score
  // --------------------------------

  const scores = [
    policyScore,
    riskManagementScore,
    complianceScore,
    trainingScore,
    boardScore,
  ].filter((score) => score > 0);

  if (scores.length === 0) {
    return null;
  }

  const score =
    scores.reduce((sum, current) => sum + current, 0) / scores.length;

  let rating = "";

  if (score >= 90) {
    rating = "Excellent";
  } else if (score >= 80) {
    rating = "Good";
  } else if (score >= 65) {
    rating = "Average";
  } else if (score >= 40) {
    rating = "Poor";
  } else {
    rating = "Very Poor";
  }

  return {
    value: score,
    unit: "GOVERNANCE_SCORE",
    rating,
    score,

    policyScore,
    policyRating,

    riskManagementScore,
    riskManagementRating,

    complianceScore,
    complianceRating,

    trainingScore,
    trainingRating,

    boardScore,
    boardRating,

    rawValue: boardIndependence ?? 0,
    sourceDocumentId,
  };
}
