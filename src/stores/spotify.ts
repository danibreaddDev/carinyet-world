import { defineStore } from "pinia";

export type SpotifyUser = {
  id: string;
  displayName: string;
  email?: string;
  imageUrl?: string;
};

type SpotifyStorage = {
  user: SpotifyUser | null;
};

const STORAGE_KEY = "spotifyStore_v1";

function readStorage(): Partial<SpotifyStorage> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStorage(data: SpotifyStorage) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

const storedState = readStorage();

export const useSpotifyStore = defineStore("spotify", {
  state: () => ({
    user: storedState.user ?? null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user),
  },
  actions: {
    persist() {
      writeStorage({
        user: this.user,
      });
    },
    setUser(user: SpotifyUser | null) {
      this.user = user;
      this.persist();
    },
    logout() {
      this.user = null;

      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    },
  },
});
