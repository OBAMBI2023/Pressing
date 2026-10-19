import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { DEMO, STORAGE_KEY } from "@/lib/store";
import { routeTree } from "@/routeTree.gen";

// Renders the real route tree in memory, starting at `initialPath` as if the page had been
// opened directly in a new tab (no earlier entry inside the app).
async function renderAt(initialPath: string) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
    context: { queryClient: new QueryClient() },
  });
  await act(() => router.load());
  render(<RouterProvider router={router} />);
  return router;
}

const path = (router: Awaited<ReturnType<typeof renderAt>>) => router.state.location.pathname;

beforeEach(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ orders: DEMO }));
});
afterEach(() => {
  localStorage.clear();
});

describe("Retour button", () => {
  it("goes to /accueil when the page was opened directly", async () => {
    const router = await renderAt("/suivi/LN2587");
    fireEvent.click(await screen.findByRole("button", { name: "Retour" }));
    await screen.findByText("Bonjour,");
    expect(path(router)).toBe("/accueil");
  });

  it("goes back to the previous page after a navigation inside the app", async () => {
    const router = await renderAt("/commandes");
    await act(() => router.navigate({ to: "/suivi/$id", params: { id: "LN2587" } }));
    fireEvent.click(await screen.findByRole("button", { name: "Retour" }));
    await screen.findByRole("heading", { name: "Historique des commandes" });
    expect(path(router)).toBe("/commandes");
  });
});

describe("Confirmation page", () => {
  it("shows an error, not a success message, for an unknown order", async () => {
    await renderAt("/confirmation/LN9999");
    expect(await screen.findByRole("heading", { name: "Commande introuvable" })).toBeVisible();
    expect(screen.queryByText("Commande enregistrée !")).toBeNull();
    expect(screen.queryByText(/enregistrée uniquement sur cet appareil/)).toBeNull();
    expect(screen.queryByRole("link", { name: "Suivre ma commande" })).toBeNull();
    expect(screen.getByRole("link", { name: "Mes commandes" })).toHaveAttribute(
      "href",
      "/commandes",
    );
  });

  it("keeps the success message for an existing order", async () => {
    await renderAt("/confirmation/LN2587");
    expect(await screen.findByText("#LN2587")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Commande enregistrée !" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Suivre ma commande" })).toHaveAttribute(
      "href",
      "/suivi/LN2587",
    );
    expect(screen.queryByRole("heading", { name: "Commande introuvable" })).toBeNull();
  });
});
