import { getAuthJWTStorageName } from "@/lib/config";
import { useState, useEffect } from "react";

function useAuthJwt() {
  const [authJwt, setAuthJwt] = useState<string | null>(null);
  const authJwtName = getAuthJWTStorageName();

  useEffect(() => {
    const token = localStorage.getItem(authJwtName);
    if (token) {
      setAuthJwt(token);
    } else {
      console.info("No Auth JWT found in local storage");
    }
  }, []);

  return authJwt;
}

export default useAuthJwt;
