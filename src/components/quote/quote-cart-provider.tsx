"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type QuoteCartItem = {
  productId: string;
  slug: string | null;
  name: string;
  image: string | null;
  price: number | null;
  currency: string;
  quantity: number;
  customSpecs?: string;
  notes?: string;
};

type QuoteCartContextValue = {
  items: QuoteCartItem[];
  /** Number of distinct line items. */
  count: number;
  totalQuantity: number;
  addItem: (item: Omit<QuoteCartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateItem: (productId: string, patch: Partial<QuoteCartItem>) => void;
  clear: () => void;
  isInCart: (productId: string) => boolean;
};

const STORAGE_KEY = "boxspace-quote-cart";

const QuoteCartContext = createContext<QuoteCartContextValue | null>(null);

export function QuoteCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteCartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted cart on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as QuoteCartItem[]);
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  // Persist on change (after hydration to avoid clobbering on first render).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage may be unavailable (private mode) — non-fatal
    }
  }, [items, hydrated]);

  const addItem = useCallback<QuoteCartContextValue["addItem"]>((item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      const qty = item.quantity ?? 1;
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + qty }
            : i,
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId
            ? { ...i, quantity: Math.max(1, quantity) }
            : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const updateItem = useCallback(
    (productId: string, patch: Partial<QuoteCartItem>) => {
      setItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, ...patch } : i)),
      );
    },
    [],
  );

  const clear = useCallback(() => setItems([]), []);

  const isInCart = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items],
  );

  const value = useMemo<QuoteCartContextValue>(
    () => ({
      items,
      count: items.length,
      totalQuantity: items.reduce((sum, i) => sum + i.quantity, 0),
      addItem,
      removeItem,
      updateQuantity,
      updateItem,
      clear,
      isInCart,
    }),
    [items, addItem, removeItem, updateQuantity, updateItem, clear, isInCart],
  );

  return (
    <QuoteCartContext.Provider value={value}>
      {children}
    </QuoteCartContext.Provider>
  );
}

export function useQuoteCart(): QuoteCartContextValue {
  const ctx = useContext(QuoteCartContext);
  if (!ctx) {
    throw new Error("useQuoteCart must be used within a QuoteCartProvider");
  }
  return ctx;
}
