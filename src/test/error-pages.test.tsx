import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderErrorPage } from "@/lib/error-page";
import { Route as RootRoute } from "@/routes/__root";

describe("Server error page", () => {
  it("is in French", () => {
    const html = renderErrorPage();
    expect(html).toContain('<html lang="fr">');
    expect(html).toContain("<title>Cette page n'a pas pu se charger</title>");
    expect(html).toContain(">Réessayer</button>");
    expect(html).toContain(">Retour à l'accueil</a>");
    expect(html).not.toMatch(/didn't load|try again|go home/i);
  });
});

describe("Root error component", () => {
  it("is in French when a page crashes", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const Boom = () => {
      throw new Error("boom");
    };
    const router = createRouter({
      routeTree: createRootRoute({
        component: Boom,
        errorComponent: RootRoute.options.errorComponent,
      }),
      history: createMemoryHistory({ initialEntries: ["/"] }),
    });
    await act(() => router.load());
    render(<RouterProvider router={router} />);

    expect(
      await screen.findByRole("heading", { name: "Cette page n'a pas pu se charger" }),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Réessayer" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Retour à l'accueil" })).toHaveAttribute("href", "/");
    expect(screen.queryByText(/didn't load|try again|go home/i)).toBeNull();
    vi.restoreAllMocks();
  });
});
