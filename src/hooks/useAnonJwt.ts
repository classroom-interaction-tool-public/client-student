import { getAnonJWTStorageName } from "../lib/config";
import { useState, useEffect } from "react";

function useAnonJwt() {
  const [anonJwt, setAnonJwt] = useState<string | null>(null);

  useEffect(() => {
    const anonJwtName = getAnonJWTStorageName();
    const token = localStorage.getItem(anonJwtName);
    if (token) {
      setAnonJwt(token);
    } else {
      console.info("No Anon JWT found in local storage");
    }
  }, []);

  return anonJwt;
}

export default useAnonJwt;
