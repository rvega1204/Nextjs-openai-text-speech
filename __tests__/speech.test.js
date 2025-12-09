import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Speech from "../app/speech/page";

// Mock global fetch
global.fetch = vi.fn();

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => "mock-url");

describe("Speech Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetch.mockClear();
  });

  it("renders the Speech component correctly", () => {
    render(<Speech />);
    expect(screen.getByText(/Text to Speech Converter/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/Enter text here.../i)).toBeDefined();
    expect(screen.getByRole("button", { name: /Play Speech/i })).toBeDefined();
  });

  it("validates input length", async () => {
    render(<Speech />);
    const textarea = screen.getByPlaceholderText(/Enter text here.../i);
    const button = screen.getByRole("button", { name: /Play Speech/i });

    // Test too short
    fireEvent.change(textarea, { target: { value: "Hi" } });
    fireEvent.blur(textarea);

    await waitFor(() => {
      expect(
        screen.getByText(/Must be at least 5 characters long/i)
      ).toBeDefined();
    });
    expect(button).toBeDisabled();
  });

  it("handles successful speech generation", async () => {
    let resolveFetch;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });

    fetch.mockReturnValue(fetchPromise);

    const { container } = render(<Speech />);
    const textarea = screen.getByPlaceholderText(/Enter text here.../i);
    const button = screen.getByRole("button", { name: /Play Speech/i });

    fireEvent.change(textarea, { target: { value: "Hello world testing" } });
    fireEvent.click(button);

    // Should be processing now
    await waitFor(() => {
      expect(button).toHaveTextContent("Processing...");
    });
    expect(button).toBeDisabled();

    // Resolve the fetch
    resolveFetch({
      ok: true,
      blob: async () => new Blob(["audio data"], { type: "audio/mpeg" }),
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/speech",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ text: "Hello world testing" }),
        })
      );
    });

    await waitFor(() => {
      expect(button).toHaveTextContent("Play Speech");
      const audio = container.querySelector("audio");
      expect(audio).toBeDefined();
      expect(audio).toHaveAttribute("src", "mock-url");
    });
  });

  it("handles API error", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({ message: "Something went wrong" }),
    });

    render(<Speech />);
    const textarea = screen.getByPlaceholderText(/Enter text here.../i);
    const button = screen.getByRole("button", { name: /Play Speech/i });

    fireEvent.change(textarea, { target: { value: "Hello world testing" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to fetch speech: 500 - Something went wrong/i)
      ).toBeDefined();
    });
  });
});
