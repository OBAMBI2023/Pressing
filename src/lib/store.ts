import { createContext, useContext } from "react";
import { z } from "zod";

export type ServiceId = "lavage" | "repassage" | "sec";
export const SERVICES: { id: ServiceId; name: string; desc: string; from: number }[] = [
  { id: "lavage", name: "Lavage", desc: "Vêtements, linge de maison, serviettes", from: 500 },
  { id: "repassage", name: "Repassage", desc: "Vêtements soigneusement repassés", from: 300 },
  { id: "sec", name: "Nettoyage à sec", desc: "Costumes, robes, tissus délicats", from: 1500 },
];
export const ITEMS = [
  { id: "tshirt", name: "T-shirt", prices: { lavage: 500, repassage: 300, sec: 1500 } },
  { id: "pantalon", name: "Pantalon", prices: { lavage: 1000, repassage: 500, sec: 2000 } },
  { id: "chemise", name: "Chemise", prices: { lavage: 800, repassage: 500, sec: 1800 } },
  { id: "robe", name: "Robe", prices: { lavage: 1500, repassage: 800, sec: 3000 } },
  { id: "costume", name: "Costume", prices: { lavage: 2500, repassage: 1500, sec: 5000 } },
  { id: "drap", name: "Drap", prices: { lavage: 1200, repassage: 700, sec: 2500 } },
] as const;
export type ItemId = (typeof ITEMS)[number]["id"];
export const DELIVERY_FEE = 1000;
export const SLOTS = ["08h - 12h", "12h - 16h", "16h - 20h"];
export const STEPS = [
  "Commande reçue",
  "Collecte du linge",
  "Lavage en cours",
  "Repassage",
  "Préparation",
  "Livraison",
];
export const LAST_STEP = STEPS.length - 1;

export type CartLine = { key: string; item: ItemId; service: ServiceId; qty: number };
export type Mode = "domicile" | "pressing";
export type Logistics = { mode: Mode; address: string; date: string; slot: string; note: string };
export type Payment = "mobile" | "carte" | "retrait";
export type Order = {
  id: string;
  date: string;
  lines: CartLine[];
  logistics: Logistics;
  payment: Payment;
  subtotal: number;
  fee: number;
  total: number;
  step: number;
  demo?: boolean | undefined;
};

export const fmt = (n: number) =>
  n.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ") + " FCFA";
export const itemOf = (id: ItemId) => ITEMS.find((i) => i.id === id)!;
export const serviceOf = (id: ServiceId) => SERVICES.find((s) => s.id === id)!;
export const linePrice = (l: CartLine) => itemOf(l.item).prices[l.service] * l.qty;
export const subtotalOf = (lines: CartLine[]) => lines.reduce((a, l) => a + linePrice(l), 0);
export const feeOf = (mode: Mode) => (mode === "domicile" ? DELIVERY_FEE : 0);
export const isDelivered = (o: Order) => o.step >= LAST_STEP;

// Dates are stored as "YYYY-MM-DD" in the user's local calendar. `new Date("YYYY-MM-DD")`
// and `toISOString()` both work in UTC, which shifts the day for users outside GMT.
export const todayISO = (now = new Date()) =>
  [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map((n) => String(n).padStart(2, "0"))
    .join("-");
export const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("fr-FR");
};

// Sequential ids: unique among existing orders (demo ones included), unlike random ids.
export const nextOrderId = (orders: Order[]) => {
  const max = orders.reduce((a, o) => Math.max(a, Number(o.id.slice(2)) || 0), 2600);
  return `LN${max + 1}`;
};

export const DEMO: Order[] = [
  {
    id: "LN2587",
    date: "2026-10-15",
    step: 2,
    demo: true,
    payment: "mobile",
    subtotal: 8500,
    fee: 1000,
    total: 9500,
    lines: [
      { key: "a", item: "tshirt", service: "lavage", qty: 2 },
      { key: "b", item: "chemise", service: "sec", qty: 1 },
    ],
    logistics: {
      mode: "domicile",
      address: "Cocody, Abidjan",
      date: "2026-10-15",
      slot: "08h - 12h",
      note: "",
    },
  },
  {
    id: "LN2586",
    date: "2026-10-08",
    step: 5,
    demo: true,
    payment: "carte",
    subtotal: 12000,
    fee: 0,
    total: 12000,
    lines: [
      { key: "c", item: "costume", service: "sec", qty: 2 },
      { key: "d", item: "pantalon", service: "lavage", qty: 2 },
    ],
    logistics: {
      mode: "pressing",
      address: "Pressing Riviera 3",
      date: "2026-10-08",
      slot: "12h - 16h",
      note: "",
    },
  },
];

export type Ctx = {
  cart: CartLine[];
  orders: Order[];
  logistics: Logistics;
  user: { name: string; email: string } | null;
  points: number;
  setQty: (item: ItemId, service: ServiceId, qty: number) => void;
  clearCart: () => void;
  setLogistics: (l: Logistics) => void;
  placeOrder: (p: Payment) => Order;
  login: (name: string, email: string) => void;
  logout: () => void;
};
export const StoreContext = createContext<Ctx | null>(null);
export const defaultLog: Logistics = {
  mode: "domicile",
  address: "",
  date: "",
  slot: "",
  note: "",
};
export const STORAGE_KEY = "laundry-demo";

const cartLineSchema = z.object({
  key: z.string(),
  item: z.enum(ITEMS.map((i) => i.id) as [ItemId, ...ItemId[]]),
  service: z.enum(SERVICES.map((s) => s.id) as [ServiceId, ...ServiceId[]]),
  qty: z.number().int().positive(),
});
const logisticsSchema = z.object({
  mode: z.enum(["domicile", "pressing"]),
  address: z.string(),
  date: z.string(),
  slot: z.string(),
  note: z.string(),
});
const orderSchema = z.object({
  id: z.string(),
  date: z.string(),
  lines: z.array(cartLineSchema),
  logistics: logisticsSchema,
  payment: z.enum(["mobile", "carte", "retrait"]),
  subtotal: z.number(),
  fee: z.number(),
  total: z.number(),
  step: z.number().int().min(0).max(LAST_STEP),
  demo: z.boolean().optional(),
});
const userSchema = z.object({ name: z.string(), email: z.string() });

export type Persisted = Pick<Ctx, "cart" | "orders" | "logistics" | "user">;

// Validates each field of the saved state on its own: a corrupted or outdated field falls
// back to its default instead of crashing the pages that read it.
export const parsePersisted = (raw: string | null): Persisted => {
  let data: Record<string, unknown> = {};
  try {
    const parsed: unknown = JSON.parse(raw ?? "null");
    if (parsed && typeof parsed === "object") data = parsed as Record<string, unknown>;
  } catch {
    /* corrupted JSON: use defaults */
  }
  const field = <T>(schema: z.ZodType<T>, value: unknown, fallback: T) => {
    const r = schema.safeParse(value);
    return r.success ? r.data : fallback;
  };
  return {
    cart: field(z.array(cartLineSchema), data["cart"], []),
    orders: field(z.array(orderSchema), data["orders"], DEMO),
    logistics: field(logisticsSchema, data["logistics"], defaultLog),
    user: field(userSchema.nullable(), data["user"], null),
  };
};

export const useStore = () => {
  const c = useContext(StoreContext);
  if (!c) throw new Error("no store");
  return c;
};
