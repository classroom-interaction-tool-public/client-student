import { getApiBaseUrl } from "./config";

export const API_BASE_URL = getApiBaseUrl();

export async function fetchQuestionCollection(
  sessionId: string,
  questionCollectionNr: string,
  jwt: string
) {
  const response = await fetch(
    `${API_BASE_URL}/session/${sessionId}/question-collection/${questionCollectionNr}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function fetchSession(sessionCode: string, jwt?: string) {
  const response = await fetch(`${API_BASE_URL}/session/${sessionCode}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: jwt ? `Bearer ${jwt}` : "",
    },
    body: JSON.stringify({ sessionCode }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}
