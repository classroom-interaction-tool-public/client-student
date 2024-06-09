"use client";
import React, { use, useEffect, useState } from "react";
import {
  Container,
  TextInput,
  Button,
  Center,
  useMantineTheme,
  Card,
} from "@mantine/core";

import { useRouter } from "next/navigation";
import useAnonJwt from "@/hooks/useAnonJwt";
import useAuthJwt from "@/hooks/useAuthJwt";
import { fetchSession } from "@/lib/api";
import { getAnonJWTStorageName } from "@/lib/config";

interface SessionResponse {
  session: {
    id: string;
    questionCollectionIds: string[];
  };
  anonJwt?: string;
  authJwt?: string;
}

const HomePage = () => {
  const [sessionCode, setSessionCode] = useState("");
  const [joinAnonumously, setJoinAnonumously] = useState(true);
  const theme = useMantineTheme();
  const router = useRouter();

  const anonJwt = useAnonJwt();
  const authJwt = useAuthJwt();

  const anonJwtName = getAnonJWTStorageName();

  const [envtest, setEnvtest] = useState("");

  useEffect(() => {
    console.log(`process env ${process.env.NEXT_PUBLIC_API_URL}`);
    console.log("Checking for session code in local storage");
    const currentSessionCode = localStorage.getItem("currentSessionCode");
    if (currentSessionCode) {
      setSessionCode(currentSessionCode);
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchData();
  };

  const fetchData = async () => {
    console.log("Session Code:", sessionCode);

    try {
      let response;

      if (joinAnonumously && anonJwt) {
        console.log("Joining anonymously with anonJwt");
        response = await fetchSession(sessionCode, anonJwt);
      } else if (joinAnonumously && !anonJwt) {
        console.log("Joining anonymously without anonJwt");
        response = await fetchSession(sessionCode);
      } else if (!joinAnonumously && authJwt) {
        console.log("Joining with authJwt");
        response = await fetchSession(sessionCode, authJwt);
      }

      handleResponse(response);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleResponse = async (response: JSON & SessionResponse) => {
    console.log(response);

    if (response.anonJwt !== undefined) {
      console.log("anonJwt:", response.anonJwt);
      localStorage.setItem(anonJwtName, response.anonJwt);
    }

    localStorage.setItem("currentSessionCode", sessionCode);
    localStorage.setItem("sessionData", JSON.stringify(response.session));

    redirectToQuestionCollection(
      response.session.id,
      response.session.questionCollectionIds[0]
    );
  };

  const redirectToQuestionCollection = (
    sessionId: string,
    questionCollectionId: string
  ) => {
    router.push(
      `/session/${sessionId}/question-collection/${questionCollectionId}`
    );
  };

  return (
    <Container size="xs" style={{ height: "100vh" }}>
      <Center style={{ height: "100%" }}>
        <Card w="90%">
          <form onSubmit={handleSubmit}>
            <TextInput
              size="xl"
              placeholder="Session Code"
              value={sessionCode}
              onChange={(event) => setSessionCode(event.currentTarget.value)}
              required
              style={{ marginBottom: theme.spacing.sm }}
            />

            <Button size="l" w="100%" type="submit">
              Join
            </Button>
          </form>
        </Card>
      </Center>
    </Container>
  );
};

export default HomePage;
