import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { AppError } from "@/app/errors/AppError";
import { ERROR_CODES } from "@/app/errors/errorCodes";
import { server } from "@/mocks/server";
import { apiUrl, httpClient } from "./httpClient";

/** Runs `promise`, expecting it to reject with an AppError. */
const appErrorFrom = async (promise: Promise<unknown>) => {
  const error = await promise.then(
    () => {
      throw new Error("Expected the request to fail");
    },
    (error: unknown) => error,
  );
  expect(error).toBeInstanceOf(AppError);
  return error as AppError;
};

describe("httpClient success responses", () => {
  it("returns the parsed JSON body", async () => {
    server.use(
      http.get(apiUrl("/things"), () => HttpResponse.json([{ id: 1 }])),
    );

    await expect(httpClient.get("/things")).resolves.toEqual([{ id: 1 }]);
  });

  it("serializes query params, skipping empty values", async () => {
    let receivedUrl: URL | undefined;
    server.use(
      http.get(apiUrl("/things"), ({ request }) => {
        receivedUrl = new URL(request.url);
        return HttpResponse.json([]);
      }),
    );

    await httpClient.get("/things", {
      query: { page: 2, search: "milk", tag: undefined, owner: null },
    });

    expect(receivedUrl?.pathname).toBe("/api/things");
    expect(receivedUrl?.search).toBe("?page=2&search=milk");
  });

  it("sends the body as JSON", async () => {
    let received: { body: unknown; contentType: string | null } | undefined;
    server.use(
      http.post(apiUrl("/things"), async ({ request }) => {
        received = {
          body: await request.json(),
          contentType: request.headers.get("Content-Type"),
        };
        return HttpResponse.json({ id: 1 }, { status: 201 });
      }),
    );

    await httpClient.post("/things", { title: "New" });

    expect(received).toEqual({
      body: { title: "New" },
      contentType: "application/json",
    });
  });

  it("returns undefined for an empty response", async () => {
    server.use(
      http.delete(
        apiUrl("/things/1"),
        () => new HttpResponse(null, { status: 204 }),
      ),
    );

    await expect(httpClient.delete("/things/1")).resolves.toBeUndefined();
  });
});

describe("httpClient error responses", () => {
  it.each([
    [401, ERROR_CODES.UNAUTHORIZED, "You need to log in."],
    [
      403,
      ERROR_CODES.FORBIDDEN,
      "You don't have permission to access this page.",
    ],
    [404, ERROR_CODES.NOT_FOUND, "Page not found."],
    [
      500,
      ERROR_CODES.SERVER_ERROR,
      "The server ran into a problem. Please try again later.",
    ],
  ])(
    "turns a %i into %s with our own user message",
    async (status, code, userMessage) => {
      server.use(
        http.get(apiUrl("/things"), () =>
          HttpResponse.json({ message: "Internal detail" }, { status }),
        ),
      );

      const error = await appErrorFrom(httpClient.get("/things"));

      expect(error.code).toBe(code);
      expect(error.status).toBe(status);
      // The server's text is kept for developers, not shown to users.
      expect(error.message).toBe("Internal detail");
      expect(error.userMessage).toBe(userMessage);
    },
  );

  it("shows validation messages to the user and keeps field errors", async () => {
    const errors = { title: ["Title is required"] };
    server.use(
      http.post(apiUrl("/things"), () =>
        HttpResponse.json(
          { message: "Title is required", errors },
          { status: 422 },
        ),
      ),
    );

    const error = await appErrorFrom(httpClient.post("/things", {}));

    expect(error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
    expect(error.userMessage).toBe("Title is required");
    expect(error.details).toEqual(errors);
  });

  it("reads plain-text error bodies", async () => {
    server.use(
      http.get(apiUrl("/things"), () =>
        HttpResponse.text("Bad gateway", { status: 502 }),
      ),
    );

    const error = await appErrorFrom(httpClient.get("/things"));

    expect(error.code).toBe(ERROR_CODES.SERVER_ERROR);
    expect(error.message).toBe("Bad gateway");
  });

  it("falls back to the status when the error body is empty", async () => {
    server.use(
      http.get(
        apiUrl("/things"),
        () =>
          new HttpResponse(null, { status: 503, statusText: "Unavailable" }),
      ),
    );

    const error = await appErrorFrom(httpClient.get("/things"));

    expect(error.code).toBe(ERROR_CODES.SERVER_ERROR);
    expect(error.message).toBe("503 Unavailable");
  });
});

describe("httpClient failures without a usable response", () => {
  it("turns a failed request into a network error", async () => {
    server.use(http.get(apiUrl("/things"), () => HttpResponse.error()));

    const error = await appErrorFrom(httpClient.get("/things"));

    expect(error.code).toBe(ERROR_CODES.NETWORK_ERROR);
    expect(error.userMessage).toBe("Unable to connect to the server.");
    expect(error.cause).toBeDefined();
  });

  it("treats an unreadable success body as a server error", async () => {
    server.use(
      http.get(
        apiUrl("/things"),
        () =>
          new HttpResponse("{not json", {
            headers: { "Content-Type": "application/json" },
          }),
      ),
    );

    const error = await appErrorFrom(httpClient.get("/things"));

    expect(error.code).toBe(ERROR_CODES.SERVER_ERROR);
  });

  it("passes cancellations through instead of reporting an error", async () => {
    server.use(http.get(apiUrl("/things"), () => new Promise<never>(() => {})));
    const controller = new AbortController();

    const request = httpClient.get("/things", { signal: controller.signal });
    controller.abort();

    const error = await request.catch((error: unknown) => error);
    expect(error).not.toBeInstanceOf(AppError);
    expect(controller.signal.aborted).toBe(true);
  });
});
