export interface ITest {
  id: string;
  name: string;
  description: string;
  time_limit_minutes: number;
}

export interface IQuestion {
  id: string;
  text: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}

export interface IUserAnswer {
  question_id: string;
  answer: string;
}

export interface ISubmissionResponse {
  iq_score: number;
}

export interface IResultHistory {
  id: number;
  score: number;
  created_at: string; // Las fechas vienen como strings desde la API
  test: ITest; // ¡Anidamos el tipo ITest!
}