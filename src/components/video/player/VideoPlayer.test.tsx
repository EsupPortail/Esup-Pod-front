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

describe("VideoPlayer", () => {
  it("renders correctly with loader initially", () => {
    const videoMock = { id: 1, title: "Test video", slug: "test-video", subtitles: [] } as any;
    const { container } = render(<VideoPlayer video={videoMock} streamUrl="http://test/stream.mp4" />);
    expect(container.querySelector("div")).not.toBeNull();
  });
});
