// utils/config.ts

//const prod = process.env.APP_ENV === "production";

// const getApiBaseUrl = () => {
//   //if (minikube) return "http://fastify-api-service:5000";
//   //if (prod) return "http://production-api-url:5000";
//   //return "http://localhost:5000";
//   //return "http://localhost:5003";
//   return "http://10.212.26.199:5003";
// };

//export const API_BASE_URL = getApiBaseUrl();

export const getApiBaseUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not defined in the environment variables"
    );
  }

  return apiUrl;
};

export const getAnonJWTStorageName = (): string => {
  const anonJwt = process.env.NEXT_PUBLIC_LOCAL_STORAGE_ANON_JWT;

  if (!anonJwt) {
    throw new Error(
      "NEXT_PUBLIC_LOCAL_STORAGE_ANON_JWT is not defined in the environment variables"
    );
  }

  return anonJwt;
};

export const getAuthJWTStorageName = (): string => {
  const authJwt = process.env.NEXT_PUBLIC_LOCAL_STORAGE_AUTH_JWT;

  if (!authJwt) {
    throw new Error(
      "NEXT_PUBLIC_LOCAL_STORAGE_AUTH_JWT is not defined in the environment variables"
    );
  }

  return authJwt;
};
