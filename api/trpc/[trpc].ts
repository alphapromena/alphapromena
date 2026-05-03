import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../server/routers";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({ req }),
    onError({ error, path }) {
      console.error(`tRPC error on ${path}:`, error);
    },
  });
}
