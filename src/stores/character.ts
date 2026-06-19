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
//levels increase
const INCREASE_LEVEL = 0.2;
const DECREASE_LEVEL = -0.2;
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
    async increaseLevel() {
      const { error } = await supabase.rpc("update_character_level", {
        p_character_id: this.character.id,
        p_level_delta: INCREASE_LEVEL,
      });
      if (error) {
        console.warn("update increase Level failed:", error);
        return;
      }
      this.character.level += INCREASE_LEVEL;
      setCachedCharacter(this.character.id, this.character);
    },
    async decreaseLevel() {
      const { error } = await supabase.rpc("update_character_level", {
        p_character_id: this.character.id,
        p_level_delta: DECREASE_LEVEL,
      });
      if (error) {
        console.warn("update descrease Level failed:", error);
        return;
      }
      this.character.level += DECREASE_LEVEL;
      setCachedCharacter(this.character.id, this.character);
    },
  },
});
