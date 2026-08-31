import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import VideoPlayer from "./VideoPlayer";

vi.mock("video.js", () => {
  return {
    default: vi.fn(() => ({
      on: vi.fn(),
      one: vi.fn(),
      src: vi.fn(),
      dispose: vi.fn(),
      hotkeys: vi.fn()
    }))
  };
});

vi.mock("@/src/context/AuthProvider", () => ({
  useAuth: vi.fn(() => ({
    accessToken: "fake-token",
    refresh: vi.fn(),
  })),
}));

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("VideoPlayer", () => {
  it("renders correctly with loader initially", () => {
    const queryClient = new QueryClient();
    const videoMock = { id: 1, title: "Test video", slug: "test-video", subtitles: [] } as any;
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <VideoPlayer video={videoMock} streamUrl="http://test/stream.mp4" />
      </QueryClientProvider>
    );
    expect(container.querySelector("div")).not.toBeNull();
  });
});
