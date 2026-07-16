import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

function withAuthErrorLogging(handler: (request: Request) => Promise<Response>) {
  return async (request: Request) => {
    try {
      return await handler(request);
    } catch (error) {
      console.error("[auth] Unhandled Better Auth route error", {
        method: request.method,
        url: request.url,
        error,
      });

      return Response.json(
        { error: "Authentication server error" },
        { status: 500 },
      );
    }
  };
}

export const GET = withAuthErrorLogging(handlers.GET);
export const POST = withAuthErrorLogging(handlers.POST);
