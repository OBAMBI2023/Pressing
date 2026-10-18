import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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
export const STEPS = ["Commande reçue", "Collecte du linge", "Lavage en cours", "Repassage", "Préparation", "Livraison"];

export type CartLine = { key: string; item: ItemId; service: ServiceId; qty: number };
export type Mode = "domicile" | "pressing";
export type Logistics = { mode: Mode; address: string; date: string; slot: string; note: string };
export type Payment = "mobile" | "carte" | "retrait";
export type Order = {
  id: string; date: string; lines: CartLine[]; logistics: Logistics; payment: Payment;
  subtotal: number; fee: number; total: number; step: number; demo?: boolean;
};

export const fmt = (n: number) => n.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ") + " FCFA";
export const itemOf = (id: ItemId) => ITEMS.find((i) => i.id === id)!;
export const serviceOf = (id: ServiceId) => SERVICES.find((s) => s.id === id)!;
export const linePrice = (l: CartLine) => itemOf(l.item).prices[l.service] * l.qty;
export const subtotalOf = (lines: CartLine[]) => lines.reduce((a, l) => a + linePrice(l), 0);
export const feeOf = (mode: Mode) => (mode === "domicile" ? DELIVERY_FEE : 0);

const DEMO: Order[] = [
  { id: "LN2587", date: "2026-10-15", step: 2, demo: true, payment: "mobile", subtotal: 8500, fee: 1000, total: 9500,
    lines: [{ key: "a", item: "tshirt", service: "lavage", qty: 2 }, { key: "b", item: "chemise", service: "sec", qty: 1 }],
    logistics: { mode: "domicile", address: "Cocody, Abidjan", date: "2026-10-15", slot: "08h - 12h", note: "" } },
  { id: "LN2586", date: "2026-10-08", step: 5, demo: true, payment: "carte", subtotal: 12000, fee: 0, total: 12000,
    lines: [{ key: "c", item: "costume", service: "sec", qty: 2 }, { key: "d", item: "pantalon", service: "lavage", qty: 2 }],
    logistics: { mode: "pressing", address: "Pressing Riviera 3", date: "2026-10-08", slot: "12h - 16h", note: "" } },
];

type Ctx = {
  cart: CartLine[]; orders: Order[]; logistics: Logistics; user: { name: string; email: string } | null; points: number;
  setQty: (item: ItemId, service: ServiceId, qty: number) => void; clearCart: () => void;
  setLogistics: (l: Logistics) => void; placeOrder: (p: Payment) => Order;
  login: (name: string, email: string) => void; logout: () => void;
};
const C = createContext<Ctx | null>(null);
const defaultLog: Logistics = { mode: "domicile", address: "", date: "", slot: "", note: "" };

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>(DEMO);
  const [logistics, setLogistics] = useState<Logistics>(defaultLog);
  const [user, setUser] = useState<Ctx["user"]>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("laundry-demo") || "null");
      if (s) { setCart(s.cart ?? []); setOrders(s.orders ?? DEMO); setUser(s.user ?? null); setLogistics(s.logistics ?? defaultLog); }
    } catch { /* ignore */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem("laundry-demo", JSON.stringify({ cart, orders, user, logistics }));
  }, [cart, orders, user, logistics, ready]);

  const setQty: Ctx["setQty"] = (item, service, qty) =>
    setCart((c) => {
      const key = `${item}-${service}`;
      const rest = c.filter((l) => l.key !== key);
      if (qty <= 0) return rest;
      const existing = c.find((l) => l.key === key);
      return existing ? c.map((l) => (l.key === key ? { ...l, qty } : l)) : [...c, { key, item, service, qty }];
    });

  const placeOrder = (payment: Payment) => {
    const subtotal = subtotalOf(cart); const fee = feeOf(logistics.mode);
    const o: Order = { id: "LN" + Math.floor(2600 + Math.random() * 7000), date: new Date().toISOString().slice(0, 10),
      lines: cart, logistics, payment, subtotal, fee, total: subtotal + fee, step: 0 };
    setOrders((p) => [o, ...p]); setCart([]); setLogistics(defaultLog);
    return o;
  };

  const points = 120 + orders.filter((o) => !o.demo).reduce((a, o) => a + Math.floor(o.total / 100), 0) + 200;

  return (
    <C.Provider value={{ cart, orders, logistics, user, points, setQty, clearCart: () => setCart([]), setLogistics, placeOrder,
      login: (name, email) => setUser({ name, email }), logout: () => setUser(null) }}>
      {children}
    </C.Provider>
  );
}
export const useStore = () => { const c = useContext(C); if (!c) throw new Error("no store"); return c; };
