import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { cartAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const CartContext = createContext(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

// Normalize a backend cart item into the shape the UI expects.
// Backend populates material.supplier (not material.supplierId).
const toUiItem = (ci) => {
  if (!ci) return null;
  const m = ci.material || {};
  const supplier = m.supplier || {};
  const supplierId = typeof supplier === "object" ? supplier._id : supplier;
  const supplierName =
    (typeof supplier === "object"
      ? supplier.businessName || supplier.name
      : null) || "Supplier";
  return {
    id: String(m._id || ci.materialId || ""),
    materialId: String(m._id || ci.materialId || ""),
    name: m.name || "",
    price: m.price || 0,
    image: m.image || "",
    unit: m.unit || "unit",
    stock: m.stock,
    supplierId: supplierId ? String(supplierId) : null,
    supplierName,
    quantity: ci.quantity || 1,
  };
};

export function CartProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch full cart from backend — always use this as source of truth.
  const refresh = useCallback(async () => {
    if (!isAuthenticated || user?.role !== "vendor") {
      setItems([]);
      return;
    }
    try {
      setIsLoading(true);
      const data = await cartAPI.get();
      setItems((data.items || []).map(toUiItem).filter(Boolean));
    } catch (e) {
      // Non-vendor or backend unavailable — silently ignore.
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(
    async (item, quantity = 1) => {
      const id = item.id || item._id || item.materialId;
      if (!id) return;

      // Optimistic update so the UI feels instant.
      setItems((prev) => {
        const existing = prev.find((i) => i.id === String(id));
        if (existing) {
          return prev.map((i) =>
            i.id === String(id) ? { ...i, quantity: i.quantity + quantity } : i,
          );
        }
        return [
          ...prev,
          { ...item, id: String(id), materialId: String(id), quantity },
        ];
      });

      try {
        // Backend POST /cart returns { item } (single CartItem), not { items }.
        // So we refresh the full cart after a successful add.
        await cartAPI.add(id, quantity);
        await refresh();
        toast({ title: "Added to cart", description: item.name });
      } catch (e) {
        toast({
          title: "Could not add to cart",
          description: e.message,
          variant: "destructive",
        });
        await refresh(); // Roll back optimistic update.
      }
    },
    [refresh, toast],
  );

  const updateQuantity = useCallback(
    async (id, quantity) => {
      if (quantity <= 0) {
        setItems((prev) => prev.filter((i) => i.id !== String(id)));
        try {
          await cartAPI.remove(id);
        } catch (e) {
          await refresh();
        }
        return;
      }

      // Optimistic update.
      setItems((prev) =>
        prev.map((i) => (i.id === String(id) ? { ...i, quantity } : i)),
      );

      try {
        // Backend PUT /cart/:id returns { item }, not { items }.
        await cartAPI.update(id, quantity);
        // No need to refresh — optimistic update is correct.
      } catch (e) {
        toast({
          title: "Could not update cart",
          description: e.message,
          variant: "destructive",
        });
        await refresh(); // Roll back.
      }
    },
    [refresh, toast],
  );

  const removeItem = useCallback(
    async (id) => {
      setItems((prev) => prev.filter((i) => i.id !== String(id)));
      try {
        await cartAPI.remove(id);
      } catch (e) {
        await refresh();
      }
    },
    [refresh],
  );

  const clearCart = useCallback(async () => {
    setItems([]);
    try {
      await cartAPI.clear();
    } catch (e) {
      await refresh();
    }
  }, [refresh]);

  const isInCart = useCallback(
    (id) => items.some((i) => i.id === String(id)),
    [items],
  );

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalAmount = items.reduce(
    (s, i) => s + (i.price || 0) * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        totalItems,
        totalAmount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
        refresh,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
