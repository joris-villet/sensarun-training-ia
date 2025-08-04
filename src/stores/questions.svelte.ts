
interface Question {
  questions: { question: string; field_key: string, required: boolean }[];
  questionsIndex: number;
  type: string;
  fieldKey: string;
  required: boolean;
  isDone: boolean;
}

export const storeQuestion = $state<Question>({
  questions: [],
  questionsIndex: 0,
  type: "",
  fieldKey: "",
  required: false,
  isDone: false,
});
