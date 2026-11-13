import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  it("doesn't submit forms unless asked to", () => {
    render(
      <>
        <Button>Cancel</Button>
        <Button type="submit" variant="primary">
          Save
        </Button>
      </>,
    );

    expect(screen.getByRole("button", { name: "Cancel" })).toHaveAttribute(
      "type",
      "button",
    );
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute(
      "type",
      "submit",
    );
  });
});
