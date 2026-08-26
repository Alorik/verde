import { prisma } from "@/lib/prisma";

type SocialMetricResult = {
  value: number;
  unit: string;
  rating: string;
  score: number;

  genderDiversityScore: number;
  genderDiversityRating: string;

  turnoverScore: number;
  turnoverRating: string;

  trainingScore: number;
  trainingRating: string;

  rawValue: number;
  sourceDocumentId: string;
};

export async function calculateSocialMetric(
  assessmentId: string,
): Promise<SocialMetricResult | null> {
  const currentDocument = await prisma.document.findFirst({
    where: {
      assessmentId,
      documentType: "EMPLOYEE_DATA",
      employeeData: {
        isNot: null,
      },
    },
    orderBy: {
      uploadedAt: "desc",
    },
    select: {
      id: true,
      employeeData: {
        select: {
          totalEmployees: true,
          male: true,
          female: true,
          employeeTurnover: true,
          trainingHours: true,
        },
      },
    },
  });

  if (!currentDocument || !currentDocument.employeeData) {
    return null;
  }

  const { totalEmployees, male, female, employeeTurnover, trainingHours } =
    currentDocument.employeeData;

  if (totalEmployees <= 0) {
    throw new Error("Employee count cannot be zero");
  }

  const sourceDocumentId = currentDocument.id;

  // --------------------------------
  // Gender Diversity
  // --------------------------------

  const femalePercentage = (female / totalEmployees) * 100;

  let genderDiversityRating = "";
  let genderDiversityScore = 0;

  if (femalePercentage >= 45) {
    genderDiversityRating = "Excellent";
    genderDiversityScore = 100;
  } else if (femalePercentage >= 35) {
    genderDiversityRating = "Good";
    genderDiversityScore = 85;
  } else if (femalePercentage >= 25) {
    genderDiversityRating = "Average";
    genderDiversityScore = 70;
  } else if (femalePercentage >= 15) {
    genderDiversityRating = "Poor";
    genderDiversityScore = 50;
  } else {
    genderDiversityRating = "Very Poor";
    genderDiversityScore = 25;
  }

  // --------------------------------
  // Employee Turnover
  // --------------------------------

  const turnover = Number(employeeTurnover);

  let turnoverRating = "";
  let turnoverScore = 0;

  if (turnover <= 5) {
    turnoverRating = "Excellent";
    turnoverScore = 100;
  } else if (turnover <= 10) {
    turnoverRating = "Good";
    turnoverScore = 85;
  } else if (turnover <= 15) {
    turnoverRating = "Average";
    turnoverScore = 70;
  } else if (turnover <= 25) {
    turnoverRating = "Poor";
    turnoverScore = 50;
  } else {
    turnoverRating = "Very Poor";
    turnoverScore = 25;
  }

  // --------------------------------
  // Training Hours
  // --------------------------------

  const trainingHoursPerEmployee = trainingHours / totalEmployees;

  let trainingRating = "";
  let trainingScore = 0;

  if (trainingHoursPerEmployee >= 40) {
    trainingRating = "Excellent";
    trainingScore = 100;
  } else if (trainingHoursPerEmployee >= 30) {
    trainingRating = "Good";
    trainingScore = 85;
  } else if (trainingHoursPerEmployee >= 20) {
    trainingRating = "Average";
    trainingScore = 70;
  } else if (trainingHoursPerEmployee >= 10) {
    trainingRating = "Poor";
    trainingScore = 50;
  } else {
    trainingRating = "Very Poor";
    trainingScore = 25;
  }

  // --------------------------------
  // Overall Social Score
  // --------------------------------

  const score = (genderDiversityScore + turnoverScore + trainingScore) / 3;

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
    unit: "SOCIAL_SCORE",
    rating,
    score,

    genderDiversityScore,
    genderDiversityRating,

    turnoverScore,
    turnoverRating,

    trainingScore,
    trainingRating,

    rawValue: totalEmployees,
    sourceDocumentId,
  };
}
