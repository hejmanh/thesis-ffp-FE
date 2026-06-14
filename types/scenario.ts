// ── Scenario 1 ──────────────────────────────────────────────────────────────
export interface Scenario1Input {
  lifeExpectancy: number;
  inputFfpAge: number;
  inputFfpAnnualSpending: number;
}

export interface Scenario1WealthPoint {
  age: number;
  wealth: number;
}

export interface Scenario1Output {
  inputFfpAge: number;
  inputFfpAnnualSpending: number;
  outputIsAchievable: boolean;
  requiredWealthAtFFPAge: number;
  wealthProjection: Scenario1WealthPoint[];
}

// ── Scenario 2 ──────────────────────────────────────────────────────────────
export interface Scenario2Input {
  lifeExpectancy: number;
  inputFfpAnnualSpending: number;
}

export interface WealthProjectionPoint {
  age: number;
  wealth: number;
  requiredWealth: number;
}

export interface Scenario2Output {
  inputFfpAnnualSpending: number;
  outputFfpAge: number | null;
  wealthProjection: WealthProjectionPoint[];
}

// ── Scenario 3 ──────────────────────────────────────────────────────────────
export interface Scenario3Input {
  lifeExpectancy: number;
  inputFfpAge: number;
}

export interface RetirementCashflowPoint {
  age: number;
  wealth: number;
}

export interface Scenario3Output {
  inputFfpAge: number;
  outputFfpAnnualSpending: number;
  outputFfpMonthlySpending: number;
  retirementCashflow: RetirementCashflowPoint[];
}

// ── Scenario 4 ──────────────────────────────────────────────────────────────
export interface Scenario4Input {
  lifeExpectancy: number;
  inputFfpAge: number;
  inputFfpAnnualSpending: number;
}

export interface Scenario4Output {
  requiredAnnualSaving: number;
  ffpAge: number;
  inputFfpAnnualSpending: number;
  requiredWealthAtFFPAge: number;
}
