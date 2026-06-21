export interface SurveyQuestion {
  id: number;
  code: string;
  category: string;
  questionText: string;
}

export interface SurveyAnswer {
  questionId: number;
  score: number;
}

export interface SurveyResponsePayload {
  feedback: string;
  answers: SurveyAnswer[];
}

export interface SurveyResponseResult {
  id: number;
  submittedAt: string;
}

export interface SurveyResponseStatus {
  submitted: boolean;
  submittedAt: string | null;
}
