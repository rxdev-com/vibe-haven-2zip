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

// Normalize a backend cart item into the shape the UI expects
const toUiItem = (ci) => {
  if (!ci) return null;
  const m = ci.material || {};
  return {
    id: m._id || ci.materialId,
    materialId: m._id || ci.materialId,
    name: m.name,
    price: m.price,
    image: m.image,
    unit: m.unit,
    stock: m.stock,
    supplierId: m.supplierId?._id || m.supplierId,
    supplierName: m.supplierId?.businessName || m.supplierId?.name,
    quantity: ci.quantity,
  };
};

export function CartProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
      // ignore - cart endpoint may not be reachable for non-vendors
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(
    async (item, quantity = 1) => {
      const id = item.id || item._id || item.materialId;
      if (!id) return;
      // Optimistic update
      setItems((prev) => {
        const existing = prev.find((i) => i.id === id);
        if (existing) {
          return prev.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + quantity } : i,
          );
        }
        return [...prev, { ...item, id, materialId: id, quantity }];
      });
      try {
        const data = await cartAPI.add(id, quantity);
        setItems((data.items || []).map(toUiItem).filter(Boolean));
        toast({ title: "Added to cart", description: item.name });
      } catch (e) {
        toast({
          title: "Could not add to cart",
          description: e.message,
          variant: "destructive",
        });
        await refresh();
      }
    },
    [refresh, toast],
  );

  const updateQuantity = useCallback(
    async (id, quantity) => {
      if (quantity <= 0) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        try {
          await cartAPI.remove(id);
        } catch (e) {
          await refresh();
        }
        return;
      }
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity } : i)),
      );
      try {
        const data = await cartAPI.update(id, quantity);
        setItems((data.items || []).map(toUiItem).filter(Boolean));
      } catch (e) {
        toast({
          title: "Could not update cart",
          description: e.message,
          variant: "destructive",
        });
        await refresh();
      }
    },
    [refresh, toast],
  );

  const removeItem = useCallback(
    async (id) => {
      setItems((prev) => prev.filter((i) => i.id !== id));
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

  const isInCart = useCallback((id) => items.some((i) => i.id === id), [items]);

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
