import { useEffect, useState, type ReactNode } from "react";
import {
  DEMO,
  StoreContext,
  defaultLog,
  feeOf,
  subtotalOf,
  type CartLine,
  type Ctx,
  type Logistics,
  type Order,
  type Payment,
} from "./store";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>(DEMO);
  const [logistics, setLogistics] = useState<Logistics>(defaultLog);
  const [user, setUser] = useState<Ctx["user"]>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("laundry-demo") || "null");
      if (s) {
        setCart(s.cart ?? []);
        setOrders(s.orders ?? DEMO);
        setUser(s.user ?? null);
        setLogistics(s.logistics ?? defaultLog);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      localStorage.setItem("laundry-demo", JSON.stringify({ cart, orders, user, logistics }));
  }, [cart, orders, user, logistics, ready]);

  const setQty: Ctx["setQty"] = (item, service, qty) =>
    setCart((c) => {
      const key = `${item}-${service}`;
      const rest = c.filter((l) => l.key !== key);
      if (qty <= 0) return rest;
      const existing = c.find((l) => l.key === key);
      return existing
        ? c.map((l) => (l.key === key ? { ...l, qty } : l))
        : [...c, { key, item, service, qty }];
    });

  const placeOrder = (payment: Payment) => {
    const subtotal = subtotalOf(cart);
    const fee = feeOf(logistics.mode);
    const o: Order = {
      id: "LN" + Math.floor(2600 + Math.random() * 7000),
      date: new Date().toISOString().slice(0, 10),
      lines: cart,
      logistics,
      payment,
      subtotal,
      fee,
      total: subtotal + fee,
      step: 0,
    };
    setOrders((p) => [o, ...p]);
    setCart([]);
    setLogistics(defaultLog);
    return o;
  };

  const points =
    120 + orders.filter((o) => !o.demo).reduce((a, o) => a + Math.floor(o.total / 100), 0) + 200;

  return (
    <StoreContext.Provider
      value={{
        cart,
        orders,
        logistics,
        user,
        points,
        setQty,
        clearCart: () => setCart([]),
        setLogistics,
        placeOrder,
        login: (name, email) => setUser({ name, email }),
        logout: () => setUser(null),
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
