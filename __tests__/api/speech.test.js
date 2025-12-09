/**
 * @jest-environment node
 */
import { POST } from "../../app/api/speech/route";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => {
  return {
    openai: {
      audio: {
        speech: {
          create: vi.fn(),
        },
      },
    },
  };
});

vi.mock("next/server", () => {
  class NextResponse {
    constructor(body, init) {
      this.status = init?.status || 200;
      this.headers = new Map(Object.entries(init?.headers || {}));
      this.body = body;
    }

    static json(data, init) {
      return {
        status: init?.status || 200,
        json: async () => data,
        headers: { get: vi.fn() },
      };
    }

    static stream(body) {
      // ... logic if needed, but we switched to new NextResponse
      return new NextResponse(body, {
        status: 200,
        headers: { "Content-Type": "audio/mpeg" },
      });
    }
  }
  return { NextResponse };
});

vi.mock("openai", () => {
  return {
    default: class OpenAI {
      constructor() {
        return mocks.openai;
      }
    },
  };
});

describe("Speech API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("validates missing text", async () => {
    const req = {
      json: async () => ({}),
    };
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Text is required");
  });

  it("handles OpenAI API success", async () => {
    const req = {
      json: async () => ({ text: "Hello" }),
    };

    const mockBuffer = Buffer.from("audio data");
    mocks.openai.audio.speech.create.mockResolvedValue({
      arrayBuffer: async () => mockBuffer,
      body: "stream",
    });

    const res = await POST(req);

    if (res.status !== 200) {
      // If mocked incorrectly, we might get 500.
      // Debugging was here.
    }
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("audio/mpeg");
  });

  it("handles OpenAI API error", async () => {
    const req = {
      json: async () => ({ text: "Hello" }),
    };

    mocks.openai.audio.speech.create.mockRejectedValue(
      new Error("OpenAI Error")
    );

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("OpenAI Error");
  });
});
