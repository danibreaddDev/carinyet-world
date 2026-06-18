import { defineStore } from "pinia";
import { supabase } from "../core/lib/supabaseClient.ts";

type Character = {
  id: string;
  level: number;
};

const CACHE_KEY = "characterCache_v1";
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeCache(cache: Record<string, any>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // ignore
  }
}

function getCachedCharacter(id: string) {
  const cache = readCache();
  const entry = cache[id];
  if (!entry) return null;
  if (Date.now() - (entry.cachedAt || 0) > CACHE_TTL) return null;
  return entry.data;
}

function setCachedCharacter(id: string, data: any) {
  const cache = readCache();
  cache[id] = { data, cachedAt: Date.now() };
  writeCache(cache);
}

export const useCharacterStore = defineStore("character", {
  state: () => ({
    character: { id: "", level: 0 } as Character,
  }),
  actions: {
    setCharacter(char: Character) {
      this.character = char;
    },
    clearCache() {
      try {
        localStorage.removeItem(CACHE_KEY);
      } catch {}
    },
    async loadCharacter(selectedId: string) {
      if (!selectedId) return;
      if (selectedId === this.character.id) return;

      const cached = getCachedCharacter(selectedId);
      if (cached) {
        this.character = cached;
        return;
      }

      const { data, error } = await supabase
        .from("Characters")
        .select("*")
        .eq("id", selectedId)
        .maybeSingle();
      if (error) {
        console.warn("Character not found or query failed:", error);
        return;
      }
      if (data) {
        this.character = data;
        setCachedCharacter(selectedId, data);
      }
    },
  },
});
