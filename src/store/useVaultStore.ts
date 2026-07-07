// src/store/useVaultStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // <-- 1. Pull in the persistence engine middleware

export interface VaultItem {
  id: string;
  name: string;
  quantity: number;
  weightPerUnit: number;
}

interface VaultState {
  gold: number;
  maxWeight: number;
  items: Record<string, VaultItem>;
  getCurrentWeight: () => number;
  depositItem: (id: string, name: string, qty: number, weight: number) => boolean;
  withdrawItem: (id: string, qty: number) => boolean;
  addGold: (amount: number) => void;
  buyAsset: (id: string, name: string, price: number, weight: number) => { success: boolean; msg: string };
  sellAsset: (id: string, price: number) => { success: boolean; msg: string };
}

// 2. Wrap your store initialization with 'persist'
export const useVaultStore = create<VaultState>()(
  persist(
    (set, get) => ({
      gold: 5000,
      maxWeight: 1000,
      items: {
        dwarven_steel: { id: 'dwarven_steel', name: 'Dwarven Steel', quantity: 20, weightPerUnit: 4.5 },
        dragon_scale: { id: 'dragon_scale', name: 'Dragon Scale', quantity: 3, weightPerUnit: 12.0 },
      },

      getCurrentWeight: () => {
        return Object.values(get().items).reduce((acc, item) => acc + (item.quantity * item.weightPerUnit), 0);
      },

      depositItem: (id, name, qty, weight) => {
        const currentWeight = get().getCurrentWeight();
        if (currentWeight + (qty * weight) > get().maxWeight) return false;
        set((state) => {
          const updated = { ...state.items };
          updated[id] = updated[id] ? { ...updated[id], quantity: updated[id].quantity + qty } : { id, name, quantity: qty, weightPerUnit: weight };
          return { items: updated };
        });
        return true;
      },

      withdrawItem: (id, qty) => {
        const existing = get().items[id];
        if (!existing || existing.quantity < qty) return false;
        set((state) => {
          const updated = { ...state.items };
          if (existing.quantity - qty <= 0) delete updated[id];
          else updated[id] = { ...existing, quantity: existing.quantity - qty };
          return { items: updated };
        });
        return true;
      },

      addGold: (amount) => set((state) => ({ gold: state.gold + amount })),

      buyAsset: (id, name, price, weight) => {
        const state = get();
        if (state.gold < price) return { success: false, msg: 'INSUFFICIENT_LIQUID_CAPITAL' };
        if (state.getCurrentWeight() + weight > state.maxWeight) return { success: false, msg: 'VAULT_MAX_CAPACITY_REACHED' };

        set((prev) => {
          const updated = { ...prev.items };
          updated[id] = updated[id] ? { ...updated[id], quantity: updated[id].quantity + 1 } : { id, name, quantity: 1, weightPerUnit: weight };
          return { gold: prev.gold - price, items: updated };
        });
        return { success: true, msg: 'TRANSACTION_EXECUTED' };
      },

      sellAsset: (id, price) => {
        const existing = get().items[id];
        if (!existing || existing.quantity <= 0) return { success: false, msg: 'ASSET_NOT_FOUND_IN_VAULT' };

        set((prev) => {
          const updated = { ...prev.items };
          if (existing.quantity - 1 <= 0) delete updated[id];
          else updated[id] = { ...existing, quantity: existing.quantity - 1 };
          return { gold: prev.gold + price, items: updated };
        });
        return { success: true, msg: 'TRANSACTION_EXECUTED' };
      }
    }),
    {
      name: 'flux-freight-vault-save',
    }
  )
);
