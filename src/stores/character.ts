import { defineStore } from "pinia";
import { supabase } from "../core/lib/supabaseClient.ts";
import { useUserStore } from "./user.ts";
type Character = {
  user_id: string;
  character_id: string;
  id?: string;
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
    character: { user_id: "", character_id: "", id: "", level: 0 } as Character,
  }),
  actions: {
    setCharacter(char: Character) {
      this.character = char;
    },
    clearCache() {
      try {
        localStorage.removeItem(CACHE_KEY);
      } catch { }
    },
    async loadCharacter(selectedId: string) {
      if (!selectedId) return;
      if (selectedId === this.character.character_id) return;

      const cached = getCachedCharacter(selectedId);
      if (cached) {
        if (!cached.id) cached.id = cached.character_id;
        this.character = cached;
        return;
      }

      const { data, error } = await supabase
        .from("CharacterProgress")
        .select("*")
        .eq("character_id", selectedId)
        .eq("user_id", useUserStore().user?.id)
        .maybeSingle();
      if (error) {
        console.warn("Character not found or query failed:", error);
        return;
      }
      if (data) {
        data.id = data.character_id;
        this.character = data;
        setCachedCharacter(selectedId, data);
      }
    },
    async increaseLevel() {
      const { error } = await supabase.rpc("update_character_level", {
        p_character_id: this.character.character_id,
        p_level_delta: INCREASE_LEVEL,
      });
      if (error) {
        console.warn("update increase Level failed:", error);
        return;
      }
      this.character.level += INCREASE_LEVEL;
      setCachedCharacter(this.character.character_id, this.character);
    },
    async decreaseLevel() {
      const { error } = await supabase.rpc("update_character_level", {
        p_character_id: this.character.character_id,
        p_level_delta: DECREASE_LEVEL,
      });
      if (error) {
        console.warn("update descrease Level failed:", error);
        return;
      }
      this.character.level += DECREASE_LEVEL;
      setCachedCharacter(this.character.character_id, this.character);
    },
    async increase_other_user_level(character_id: string) {
      const { error } = await supabase.rpc("update_other_user_character_level", {
        p_character_id: character_id,
        p_level_delta: INCREASE_LEVEL,
      });
      if (error) {
        console.warn("update increase Level failed:", error);
        return false;
      }
      if (this.character.character_id === character_id) {
        this.character.level += INCREASE_LEVEL;
        setCachedCharacter(this.character.character_id, this.character);
      }
      return true;
    },
    async decrease_other_user_level(character_id: string) {
      const { error } = await supabase.rpc("update_other_user_character_level", {
        p_character_id: character_id,
        p_level_delta: DECREASE_LEVEL,
      });
      if (error) {
        console.warn("update decrease Level failed:", error);
        return false;
      }
      if (this.character.character_id === character_id) {
        this.character.level += DECREASE_LEVEL;
        setCachedCharacter(this.character.character_id, this.character);
      }
      return true;
    },
    async decrease_other_userr_level(character_id: string) {
      return this.decrease_other_user_level(character_id);
    },
  },
});
