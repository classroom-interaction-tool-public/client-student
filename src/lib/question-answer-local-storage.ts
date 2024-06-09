type QuestionAnswerPair = {
  questionId: string;
  answerId: string;
};

const STORAGE_KEY = "questionAnswers";

/**
 * Get question-answer pairs from local storage
 *
 * @returns all stored question-answer pairs from local storage or an empty array if none are found
 */
function getStoredPairs(): QuestionAnswerPair[] {
  const storedData = localStorage.getItem(STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : [];
}

/**
 * Save question-answer pairs to local storage
 *
 * @param pairs the pairs to save
 */
function saveStoredPairs(pairs: QuestionAnswerPair[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pairs));
}

/**
 * Set a question-answer pair in local storage
 *
 * @param questionId the question ID
 * @param answerId the answer ID
 */
export function setQuestionAnswerPair(
  questionId: string,
  answerId: string
): void {
  const pairs = getStoredPairs();
  const index = pairs.findIndex((pair) => pair.questionId === questionId);
  if (index > -1) {
    pairs[index].answerId = answerId;
  } else {
    pairs.push({ questionId, answerId });
  }
  saveStoredPairs(pairs);
}

/**
 * Get an answer ID for a question ID from local storage
 *
 * @param questionId the question ID
 * @returns the answer ID if found, or undefined if not found
 */
export function getAnswerIdfromQuestionId(questionId: string): string | undefined {
  const pairs = getStoredPairs();
  const pair = pairs.find((pair) => pair.questionId === questionId);
  return pair ? pair.answerId : undefined;
}

/**
 * Remove a question-answer pair from local storage
 *
 * @param questionId the question ID to remove
 */
export function removeQuestionAnswerPair(questionId: string): void {
  let pairs = getStoredPairs();
  pairs = pairs.filter((pair) => pair.questionId !== questionId);
  saveStoredPairs(pairs);
}

/**
 * Clear all question-answer pairs from local storage
 */
export function clearAllQuestionAnswerPairs(): void {
  localStorage.removeItem(STORAGE_KEY);
}
