"use client";
import {
  TextInput,
  Text,
  Divider,
  Space,
  Textarea,
  Button,
  Container,
} from "@mantine/core";
import { useEffect, useState } from "react";

import useJwt from "../../../../../hooks/useAnonJwt";
import { fetchQuestionCollection } from "@/lib/api";
import {
  getAnswerIdfromQuestionId,
  setQuestionAnswerPair,
} from "@/lib/question-answer-local-storage";
import { getApiBaseUrl } from "@/lib/config";

require("log-timestamp");

export default function Page({
  params,
}: {
  params: {
    sessionId: string;
    questionCollectionNr: string;
  };
}) {
  const { sessionId, questionCollectionNr: questionCollectioId } = params;
  const [questions, setQuestions] = useState([]);
  const [session, setSession] = useState({} as any);
  const jwt = useJwt();

  useEffect(() => {
    const fetchData = async (jwt: string | null) => {
      if (!jwt) {
        return;
      }

      try {
        const response = await fetchQuestionCollection(
          sessionId,
          questionCollectioId,
          jwt
        );

        setSession({
          ...session,
          title: response.title,
          description: response.description,
        });
        setQuestions(response.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchData(jwt);
  }, [jwt, questionCollectioId, sessionId]);

  const sendAnswer = async (text: string, questionId: string) => {
    if (!jwt) {
      console.error("No jwt found, unable to send answer");
      return;
    }

    // Only continue if the entered character is a space
    if (text[text.length - 1] !== " ") {
      return;
    }

    const API_BASE_URL = getApiBaseUrl();
    let url = `${API_BASE_URL}/session/${sessionId}/question-collection/${questionCollectioId}/question/${questionId}/answer`;
    let method = "POST";

    const storedAnswerId = getAnswerIdfromQuestionId(`${questionId}`);
    if (storedAnswerId) {
      url += `/${storedAnswerId}`;
      method = "PATCH";
    }

    console.log("Sending answer");
    const answerResponse = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        content: { type: "freeText", value: text },
      }),
    });

    const answerJson = await answerResponse.json();

    if (!storedAnswerId && answerJson._id) {
      setQuestionAnswerPair(`${questionId}`, answerJson._id);
    }
  };

  return (
    <Container pt={20}>
      {questions.map((question: any) => (
        <div key={question._id}>
          {question.title && (
            <Text w={800} size="xl">
              {question.title}
            </Text>
          )}
          {question.description && <Text>{question.description}</Text>}
          {question.questionData.questionType === "freeText" && (
            <Textarea
              autosize={true}
              minRows={10}
              maxRows={50}
              onChange={(event) =>
                sendAnswer(event.currentTarget.value, question._id)
              }
              placeholder="Your answer"
              aria-label="Free text answer"
            />
          )}
          <Space h="xl" />
          <Divider />
        </div>
      ))}

      <Space h="xl" />
      <Button>Submit</Button>
    </Container>
  );
}
