import { describe, it, expect, vi } from "vitest";
import { requestJson } from "./requestJson";

describe("requestJson", () => {
  it("should return parsed JSON when response is ok", async () => {
    const mockResponse = new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    
    const result = await requestJson<{ success: boolean }>(mockResponse);
    expect(result.success).toBe(true);
  });

  it("should throw an error with detail message when response is not ok", async () => {
    const mockResponse = new Response(JSON.stringify({ detail: "Custom error detail" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });

    await expect(requestJson(mockResponse)).rejects.toThrow("Custom error detail");
  });

  it("should throw an error with fallback message when json parsing fails", async () => {
    const mockResponse = new Response("Not a JSON", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });

    await expect(requestJson(mockResponse)).rejects.toThrow("Erreur API.");
  });

  it("should fetch and parse when given a url string", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: "fetched" }), {
        status: 200,
      })
    );

    const result = await requestJson<{ data: string }>("http://localhost/api");
    expect(global.fetch).toHaveBeenCalledWith("http://localhost/api", undefined);
    expect(result.data).toBe("fetched");
  });
});
