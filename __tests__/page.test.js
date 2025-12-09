import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "../app/page";

describe("Home Page", () => {
  it("renders the welcome heading", () => {
    render(<Home />);
    const heading = screen.getByText(/Welcome to Text to Speech Converter!/i);
    expect(heading).toBeDefined();
  });

  it("renders the Try It Now button", () => {
    render(<Home />);
    const button = screen.getByRole("button", { name: /Try It Now/i });
    expect(button).toBeDefined();
  });
});
