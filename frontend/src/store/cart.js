import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import useAuthStore from "./auth.js";
import toast from "react-hot-toast"; 

import { fetchWithAuth } from "../utils/fetchWithAuth.js";

const notify = {
    error: (msg) => toast.error(msg), // ← replace body with toast.error(msg)
};

const updateTimers = new Map();      // id -> setTimeout handle
const abortControllers = new Map();  // id -> AbortController
const itemVersions = new Map();      // id -> incrementing counter, guards stale rollbacks
const DEBOUNCE_MS = 600;

// Bumps and returns the new version number for this item.
// Any async action captures its own version at start; if a newer
// action has since bumped the counter, this action's failure/rollback
// is stale and should be ignored.
const nextVersion = (id) => {
    const v = (itemVersions.get(id) || 0) + 1;
    itemVersions.set(id, v);
    return v;
};

const useCartStore = create(persist(immer((set, get) => ({
    cart: [],
    // Shape: [{ product: { _id, image, category, name, price }, quantity }, {...}]

    setCart: (cart) => set({ cart }),

    getCartItems: async () => {
        try {
            const res = await fetchWithAuth("/api/cart");
            if (!res.ok) {
                notify.error("Couldn't load your cart.");
                return;
            }
            const data = await res.json();
            set({ cart: data.data.cart });
        } catch (error) {
            console.error("Failed to fetch cart", error);
            notify.error("Couldn't load your cart. Check your connection.");
        }
    },

    addToCart: async (product, quantity = 1) => {
        const previousCart = get().cart;
        const version = nextVersion(product._id);

        set((state) => {
            const existingItem = state.cart.find(item => item.product._id === product._id);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.cart.push({ product: { ...product }, quantity });
            }
        });

        const isLoggedIn = useAuthStore.getState().isLoggedIn;
        if (!isLoggedIn) return;

        // Cancel any in-flight request for this item before starting a new one
        if (abortControllers.has(product._id)) {
            abortControllers.get(product._id).abort();
        }
        const controller = new AbortController();
        abortControllers.set(product._id, controller);

        try {
            const res = await fetchWithAuth("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                signal: controller.signal,
                body: JSON.stringify({ productId: product._id, quantity })
            });

            if (!res.ok) {
                notify.error("Couldn't add item to your cart.");
                if (itemVersions.get(product._id) === version) {
                    set({ cart: previousCart });
                }
                return;
            }

            const data = await res.json();
            // Only trust this response if nothing newer has happened since
            if (itemVersions.get(product._id) === version) {
                set({ cart: data.data.cart });
            }

        } catch (error) {
            if (error.name === "AbortError") return; // superseded by a newer request, ignore
            console.error("addToCart failed, rolling back", error);
            notify.error("Couldn't add item to your cart. Check your connection.");
            if (itemVersions.get(product._id) === version) {
                set({ cart: previousCart });
            }
        }
    },

    updateQuantity: (id, newQuantity) => {
        newQuantity = parseInt(newQuantity);

        if (isNaN(newQuantity) || newQuantity > 10) {
            notify.error("Quantity must be between 1 and 10.");
            return;
        } else if (newQuantity < 1) {
            get().removeItem(id);
            return;
        }

        set((state) => {
            const item = state.cart.find(item => item.product._id === id);
            if (!item) {
                console.error("Product ID not found in cart");
                return;
            }
            item.quantity = newQuantity;
        });

        const isLoggedIn = useAuthStore.getState().isLoggedIn;
        if (!isLoggedIn) return;

        if (updateTimers.has(id)) {
            clearTimeout(updateTimers.get(id));
        }

        const version = nextVersion(id);

        const timer = setTimeout(async () => {
            updateTimers.delete(id);
            const previousCart = get().cart;

            if (abortControllers.has(id)) {
                abortControllers.get(id).abort();
            }
            const controller = new AbortController();
            abortControllers.set(id, controller);

            try {
                const res = await fetchWithAuth(`/api/cart/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    signal: controller.signal,
                    body: JSON.stringify({ quantity: newQuantity })
                });

                if (!res.ok) {
                    notify.error("Couldn't update quantity.");
                    if (itemVersions.get(id) === version) {
                        set({ cart: previousCart });
                    }
                    return;
                }

                const data = await res.json();
                if (itemVersions.get(id) === version) {
                    set({ cart: data.data.cart });
                }

            } catch (error) {
                if (error.name === "AbortError") return;
                console.error("updateQuantity failed, rolling back", error);
                notify.error("Couldn't update quantity. Check your connection.");
                if (itemVersions.get(id) === version) {
                    set({ cart: previousCart });
                }
            }
        }, DEBOUNCE_MS);

        updateTimers.set(id, timer);
    },

    removeItem: async (id) => {
        if (updateTimers.has(id)) {
            clearTimeout(updateTimers.get(id));
            updateTimers.delete(id);
        }
        if (abortControllers.has(id)) {
            abortControllers.get(id).abort();
        }

        const previousCart = get().cart;
        const version = nextVersion(id);

        set((state) => {
            state.cart = state.cart.filter(item => item.product._id !== id);
        });

        const isLoggedIn = useAuthStore.getState().isLoggedIn;
        if (!isLoggedIn) return;

        const controller = new AbortController();
        abortControllers.set(id, controller);

        try {
            const res = await fetchWithAuth(`/api/cart/${id}`, {
                method: "DELETE",
                signal: controller.signal
            });

            if (!res.ok) {
                notify.error("Couldn't remove item.");
                if (itemVersions.get(id) === version) {
                    set({ cart: previousCart });
                }
                return;
            }

            const data = await res.json();
            if (itemVersions.get(id) === version) {
                set({ cart: data.data.cart });
            }

        } catch (error) {
            if (error.name === "AbortError") return;
            console.error("removeItem failed, rolling back", error);
            notify.error("Couldn't remove item. Check your connection.");
            if (itemVersions.get(id) === version) {
                set({ cart: previousCart });
            }
        }
    },

    // Local-only reset (session expiry / logout) — does NOT call the server.
    clearCart: () => {
        updateTimers.forEach(timer => clearTimeout(timer));
        updateTimers.clear();
        abortControllers.forEach(controller => controller.abort());
        abortControllers.clear();
        itemVersions.clear();
        set({ cart: [] });
    },

    getTotal: () => {
        const cart = get().cart;
        return cart.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);
    },

    // User-facing "empty my cart" — syncs to the server via removeAllFromCart.
    emptyCart: async () => {
        const previousCart = get().cart;
        set({ cart: [] });

        const isLoggedIn = useAuthStore.getState().isLoggedIn;
        if (!isLoggedIn) return;

        try {
            const res = await fetchWithAuth("/api/cart", {
                method: "DELETE",
            });

            if (!res.ok) {
                notify.error("Couldn't clear your cart.");
                set({ cart: previousCart });
            }

        } catch (error) {
            console.error("emptyCart failed, rolling back", error);
            notify.error("Couldn't clear your cart. Check your connection.");
            set({ cart: previousCart });
        }
    }

})), {
    name: "cart-storage",
    partialize: (state) => ({ cart: state.cart }),
}));

export default useCartStore;