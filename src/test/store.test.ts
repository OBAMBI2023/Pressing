import { describe, expect, it } from "vitest";

import {
  DEMO,
  defaultLog,
  formatDate,
  isDelivered,
  LAST_STEP,
  nextOrderId,
  parsePersisted,
  todayISO,
  type Order,
} from "@/lib/store";

const order = (id: string, step = 0): Order => ({ ...DEMO[0]!, id, step, demo: false });

describe("nextOrderId", () => {
  it("never reuses an existing id, demo orders included", () => {
    const id = nextOrderId(DEMO);
    expect(DEMO.map((o) => o.id)).not.toContain(id);
    expect(id).toBe("LN2601");
  });

  it("follows the highest existing id", () => {
    expect(nextOrderId([order("LN2700"), order("LN2705")])).toBe("LN2706");
  });

  it("starts after 2600 when there is no order", () => {
    expect(nextOrderId([])).toBe("LN2601");
  });
});

describe("dates", () => {
  it("todayISO uses the local calendar day", () => {
    expect(todayISO(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
    expect(todayISO(new Date(2026, 11, 31, 0, 1))).toBe("2026-12-31");
  });

  it("formatDate keeps the stored day", () => {
    expect(formatDate("2026-10-15")).toBe("15/10/2026");
  });

  it("formatDate returns malformed input unchanged", () => {
    expect(formatDate("")).toBe("");
    expect(formatDate("demain")).toBe("demain");
  });
});

describe("isDelivered", () => {
  it("is true only at the last step", () => {
    expect(isDelivered(order("LN1", LAST_STEP))).toBe(true);
    expect(isDelivered(order("LN1", LAST_STEP - 1))).toBe(false);
  });
});

describe("parsePersisted", () => {
  const defaults = { cart: [], orders: DEMO, logistics: defaultLog, user: null };

  it("returns defaults when nothing is saved", () => {
    expect(parsePersisted(null)).toEqual(defaults);
  });

  it("returns defaults for corrupted JSON", () => {
    expect(parsePersisted("{not json")).toEqual(defaults);
    expect(parsePersisted("42")).toEqual(defaults);
  });

  it("keeps valid saved state", () => {
    const saved = {
      cart: [{ key: "robe-sec", item: "robe", service: "sec", qty: 2 }],
      orders: [order("LN2700", 3)],
      logistics: { ...defaultLog, address: "Cocody", date: "2026-10-20", slot: "08h - 12h" },
      user: { name: "Awa", email: "awa@example.com" },
    };
    expect(parsePersisted(JSON.stringify(saved))).toEqual(saved);
  });

  it("drops only the invalid fields", () => {
    const raw = JSON.stringify({
      cart: [{ key: "x", item: "chaussette", service: "lavage", qty: 1 }],
      orders: [{ ...order("LN2700"), step: 99 }],
      logistics: { mode: "drone" },
      user: { name: "Awa", email: "awa@example.com" },
    });
    expect(parsePersisted(raw)).toEqual({
      ...defaults,
      user: { name: "Awa", email: "awa@example.com" },
    });
  });
});
